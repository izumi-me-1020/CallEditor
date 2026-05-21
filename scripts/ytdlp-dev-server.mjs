import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createReadStream } from "node:fs";
import { mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import path from "node:path";

const HOST = process.env.COMPOSER_YTDLP_HOST ?? "127.0.0.1";
const PORT = Number.parseInt(process.env.COMPOSER_YTDLP_PORT ?? "43125", 10);
const MAX_BODY_BYTES = 8 * 1024;

function resolveYtDlpBin() {
  const configured = process.env.YT_DLP_BIN;
  if (configured) {
    return configured;
  }

  const candidates = [
    "yt-dlp",
    "/opt/homebrew/bin/yt-dlp",
    "/usr/local/bin/yt-dlp",
  ];
  const existingPath = candidates.find(
    (candidate) => candidate.includes("/") && existsSync(candidate),
  );
  return existingPath ?? "yt-dlp";
}

const YT_DLP_BIN = resolveYtDlpBin();

function writeJson(res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(body));
}

function encodeFilename(name) {
  return encodeURIComponent(name).replace(
    /['()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function buildContentDisposition(filename) {
  const fallback = filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeFilename(filename)}`;
}

function detectMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".m4a":
    case ".mp4":
      return "audio/mp4";
    case ".mp3":
      return "audio/mpeg";
    case ".wav":
      return "audio/wav";
    case ".ogg":
      return "audio/ogg";
    case ".opus":
      return "audio/ogg";
    case ".flac":
      return "audio/flac";
    case ".webm":
      return "audio/webm";
    default:
      return "application/octet-stream";
  }
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error("body_too_large");
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("invalid_json");
  }
}

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(YT_DLP_BIN, args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(
        new Error(
          stderr || stdout || `yt-dlp exited with code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

async function downloadAudio(videoId) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "calleditor-ytdlp-"));
  const outputTemplate = path.join(tempDir, "%(title)s [%(id)s].%(ext)s");
  const sourceUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  try {
    await runYtDlp([
      "--no-playlist",
      "--no-warnings",
      "--format",
      "bestaudio[ext=m4a]/bestaudio[acodec^=opus]/bestaudio",
      "--output",
      outputTemplate,
      sourceUrl,
    ]);

    const entries = await readdir(tempDir);
    const audioName = entries.find(
      (entry) => !entry.endsWith(".part") && !entry.endsWith(".ytdl"),
    );
    if (!audioName) {
      throw new Error("empty_audio");
    }

    const audioPath = path.join(tempDir, audioName);
    const details = await stat(audioPath);
    if (details.size === 0) {
      throw new Error("empty_audio");
    }

    return {
      tempDir,
      audioPath,
      filename: audioName,
      size: details.size,
      mimeType: detectMimeType(audioPath),
    };
  } catch (error) {
    await rm(tempDir, { recursive: true, force: true });
    throw error;
  }
}

function mapDownloadError(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("body_too_large")) {
    return {
      status: 413,
      code: "invalid_request",
      message: "Request body is too large.",
    };
  }
  if (message.includes("invalid_json")) {
    return {
      status: 400,
      code: "invalid_request",
      message: "Invalid JSON body.",
    };
  }
  if (message.includes("ENOENT")) {
    return {
      status: 500,
      code: "yt_dlp_missing",
      message: "yt-dlp is not installed or not on PATH.",
    };
  }
  if (
    message.includes("Video unavailable") ||
    message.includes("Private video") ||
    message.includes("Sign in to confirm")
  ) {
    return {
      status: 422,
      code: "video_unavailable",
      message: "YouTube rejected this video.",
    };
  }
  if (
    message.includes("Unsupported URL") ||
    message.includes("Incomplete YouTube ID")
  ) {
    return {
      status: 400,
      code: "invalid_video_id",
      message: "That is not a valid YouTube video ID.",
    };
  }
  if (message.includes("empty_audio")) {
    return {
      status: 502,
      code: "empty_audio",
      message: "yt-dlp returned an empty audio file.",
    };
  }
  return { status: 502, code: "yt_dlp_failed", message };
}

async function handleAudioRequest(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    const mapped = mapDownloadError(error);
    writeJson(res, mapped.status, {
      error: mapped.code,
      message: mapped.message,
    });
    return;
  }

  const videoId =
    typeof payload.videoId === "string" ? payload.videoId.trim() : "";
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    writeJson(res, 400, {
      error: "invalid_video_id",
      message: "That is not a valid YouTube video ID.",
    });
    return;
  }

  let result;
  try {
    result = await downloadAudio(videoId);
  } catch (error) {
    const mapped = mapDownloadError(error);
    writeJson(res, mapped.status, {
      error: mapped.code,
      message: mapped.message,
    });
    return;
  }

  const cleanup = () =>
    rm(result.tempDir, { recursive: true, force: true }).catch(() => undefined);
  const stream = createReadStream(result.audioPath);

  res.writeHead(200, {
    "Content-Type": result.mimeType,
    "Content-Length": String(result.size),
    "Content-Disposition": buildContentDisposition(result.filename),
    "X-CallEditor-Filename": encodeURIComponent(result.filename),
    "Cache-Control": "no-store",
  });

  stream.on("error", async () => {
    if (!res.headersSent) {
      writeJson(res, 500, {
        error: "yt_dlp_failed",
        message: "Couldn't read the downloaded audio file.",
      });
    } else {
      res.destroy();
    }
    await cleanup();
  });

  res.on("close", cleanup);
  stream.pipe(res);
}

const server = createServer(async (req, res) => {
  if (!req.url) {
    writeJson(res, 404, { error: "not_found" });
    return;
  }

  const url = new URL(req.url, `http://${HOST}:${PORT}`);
  if (req.method === "GET" && url.pathname === "/health") {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/audio") {
    await handleAudioRequest(req, res);
    return;
  }

  writeJson(res, 404, { error: "not_found" });
});

server.listen(PORT, HOST, () => {
  console.log(`[yt-dlp helper] listening on http://${HOST}:${PORT}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}

import { CobaltApiError } from "@/utils/cobalt-api";

interface LocalAudioResponse {
  file: File;
  filename?: string;
}

const ENDPOINT = "/__local_ytdlp/audio";

function readFilenameFromHeaders(headers: Headers): string | undefined {
  const raw = headers.get("x-calleditor-filename");
  if (raw) {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }

  const disposition = headers.get("content-disposition");
  if (!disposition) {
    return undefined;
  }

  const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = disposition.match(/filename="([^"]+)"/i);
  return plainMatch?.[1];
}

function mapLocalErrorCode(code: string): string {
  switch (code) {
    case "invalid_video_id":
    case "video_unavailable":
    case "empty_audio":
      return code;
    case "yt_dlp_missing":
      return "local_helper_unavailable";
    case "yt_dlp_failed":
      return "local_import_failed";
    default:
      return "cobalt_failed";
  }
}

async function parseLocalError(res: Response): Promise<never> {
  try {
    const body = (await res.json()) as { error?: string };
    throw new CobaltApiError(
      mapLocalErrorCode(body.error ?? "cobalt_failed"),
      res.status,
    );
  } catch (error) {
    if (error instanceof CobaltApiError) {
      throw error;
    }
    throw new CobaltApiError("cobalt_failed", res.status);
  }
}

async function getAudioFromLocalYtDlp(
  videoId: string,
  signal: AbortSignal,
): Promise<LocalAudioResponse> {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      signal,
      headers: {
        Accept: "audio/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    });
  } catch (error) {
    console.error("[LocalYtDlp]", "audio fetch failed", error);
    throw new CobaltApiError("network_error", 0);
  }

  if (!res.ok) {
    await parseLocalError(res);
  }

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength === 0) {
    throw new CobaltApiError("empty_audio", res.status);
  }

  const filename = readFilenameFromHeaders(res.headers);
  const safeFilename =
    filename && filename.trim().length > 0 ? filename.trim() : `${videoId}.m4a`;
  return {
    file: new File([buffer], safeFilename, {
      type: res.headers.get("content-type") ?? "application/octet-stream",
    }),
    filename,
  };
}

export { getAudioFromLocalYtDlp };

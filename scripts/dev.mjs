import { spawn } from "node:child_process";

const extraArgs = process.argv.slice(2);
const children = [];
let shuttingDown = false;

function startProcess(label, command, args, env = process.env) {
  const child = spawn(command, args, {
    stdio: "inherit",
    env,
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    for (const other of children) {
      if (other !== child && !other.killed) {
        other.kill("SIGTERM");
      }
    }
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    console.error(`[dev] failed to start ${label}:`, error);
    for (const other of children) {
      if (other !== child && !other.killed) {
        other.kill("SIGTERM");
      }
    }
    process.exit(1);
  });

  children.push(child);
  return child;
}

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  setTimeout(() => process.exit(0), 150).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startProcess("yt-dlp helper", process.execPath, ["./scripts/ytdlp-dev-server.mjs"]);
startProcess("vite", "pnpm", ["exec", "vite-react-ssg", "dev", ...extraArgs]);

import concurrently from "concurrently";
import { spawnSync } from "node:child_process";
import {
  ensureAndroidInit,
  ensureIcons,
  ensurePortFree,
  killProcessOnPort,
} from "./utils";

type Target = "web" | "desktop" | "android" | "all";

const target = Bun.argv[2] as Target | undefined;
const verbose = Bun.argv.includes("--verbose");
const forcePort = Bun.argv.includes("--force");
const forceHost = Bun.argv.includes("--host");

if (!target || !["web", "desktop", "android", "all"].includes(target)) {
  console.error(
    "Usage: bun scripts/dev.ts <web|desktop|android|all> [--verbose] [--force] [--host]",
  );
  process.exit(1);
}

await ensurePortFree(5173, forcePort);

ensureIcons("dev");
if (target === "android" || target === "all") {
  ensureAndroidInit();
}

const v = verbose ? " -v" : "";

const webCommand = {
  command: `bun run --filter @isolde/app dev${forceHost ? " --host" : ""}`,
  name: "web",
  prefixColor: "cyan",
};

const desktopCommand = {
  command: `bun --filter @isolde/tauri dev${v}`,
  name: "desktop",
  prefixColor: "blue",
};

const androidCommand = {
  command: `bun --filter @isolde/tauri tauri android dev${v}`,
  name: "android",
  prefixColor: "green",
};

const commandSets: Record<Target, (typeof webCommand)[]> = {
  web: [webCommand],
  desktop: [webCommand, desktopCommand],
  android: [webCommand, androidCommand],
  all: [webCommand, desktopCommand, androidCommand],
};

/**
 * Runs the dev server for the specified target (web, desktop, android, or all)
 *
 * @param target The target to run (web, desktop, android, or all)
 */
const { result, commands } = concurrently(commandSets[target], {
  killOthersOn: ["failure"],
});

// this whole thing doesn't work properly but i can do --force-port so it's not that important, just a note tho since idk why it's happening
function shutdown() {
  console.log("\n[shutdown] Cleaning up...");

  // kill whatever concurrently tracked (and their child process trees)
  commands.forEach((cmd) => {
    if (cmd.pid) {
      if (process.platform === "win32") {
        spawnSync("taskkill", ["/pid", String(cmd.pid), "/T", "/F"]);
      } else {
        // kill the entire process group on Unix by passing negative PID
        try {
          process.kill(-cmd.pid, "SIGKILL");
        } catch {
          cmd.kill("SIGKILL");
        }
      }
    }
  });

  // force free the dev port
  killProcessOnPort(5173);

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

result.then(
  () => process.exit(0),
  () => process.exit(1),
);

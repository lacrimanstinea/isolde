import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { createServer } from "node:net";

const TAURI_DIR = join(import.meta.dir, "..", "core", "tauri");
const ANDROID_GEN_DIR = join(TAURI_DIR, "src-tauri", "gen", "android");
// const IOS_GEN_DIR = join(TAURI_DIR, "src-tauri", "gen", "ios"); // i actually don't know if this is the correct path but ... ignore this, i don't like iOS anyway
const ICONS_DIR = join(TAURI_DIR, "src-tauri", "icons");
// these 2 are not really important but it's here just in-case, i imagine no one will mess with these values, maybe
type IconType = "dev" | "release";
const ICON_SCRIPTS: Record<IconType, string> = {
  dev: "icon:dev",
  release: "icon:release",
};

/**
 * Runs a command with the given arguments, inheriting the stdio of the parent process
 *
 * @param command The command to run
 * @param args The arguments to pass to the command
 */
export function run(command: string, args: string[]) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/**
 * Ensures that the Android project is initialized. Exits with instructions if missing.
 */
export function ensureAndroidInit() {
  if (existsSync(ANDROID_GEN_DIR)) return;

  console.error(
    "[setup] Android project not found.\n" +
      "Please run the following commands manually to initialize it:\n\n" +
      "  cd core/tauri \n" +
      "  bunx tauri android init\n",
  );

  process.exit(1);
}

/**
 * Ensures that the icons for the specified type are generated, or skips if they already exist
 *
 * @param type The icon type to generate ("dev" or "release")
 * @param force Whether to force-generate the icons, even if they already exist
 */
export function ensureIcons(type: IconType = "dev", force = false) {
  const iconTypeFile = join(ICONS_DIR, ".icontype"); // where to try and read icon from, if inexistent just refresh icons

  const existingType = existsSync(iconTypeFile)
    ? (readFileSync(iconTypeFile, "utf-8").trim() as IconType)
    : null;

  if (!force && existsSync(ICONS_DIR) && existingType === type) return;

  const script = ICON_SCRIPTS[type];
  console.log(`[setup] Generating icons (${type})...`);
  run("bun", ["run", "--filter", "@isolde/tauri", script]);

  writeFileSync(iconTypeFile, type);
}

/**
 * Checks if the specified port is available (not in use)
 *
 * @param port The port to check
 * @returns A promise that resolves to `true` if the port is available, `false` otherwise
 */
export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port, "127.0.0.1");
  });
}

/**
 * Finds and force-kills whatever process is listening on the given port, if any.
 * Safe to call even if nothing is listening (it just does nothing in that case).
 *
 * @param port The port to free
 */
export function killProcessOnPort(port: number) {
  if (process.platform === "win32") {
    const netstat = spawnSync("netstat", ["-ano"], { encoding: "utf-8" });
    const lines = (netstat.stdout ?? "")
      .split("\n")
      .filter(
        (line) => line.includes(`:${port}`) && line.includes("LISTENING"),
      );

    const pids = new Set(
      lines
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid): pid is string => !!pid && pid !== "0"),
    );

    for (const pid of pids) {
      console.log(`[setup] Killing PID ${pid} (port ${port})...`);
      spawnSync("taskkill", ["/PID", pid, "/T", "/F"]);
    }
  } else {
    const lsof = spawnSync("lsof", ["-ti", `:${port}`], { encoding: "utf-8" });
    const pids = (lsof.stdout ?? "").trim().split("\n").filter(Boolean);
    for (const pid of pids) {
      console.log(`[setup] Killing PID ${pid} (port ${port})...`);
      spawnSync("kill", ["-9", pid]);
    }
  }
}

/**
 * Ensures that the specified port is free, or exits the process if it is in use
 *
 * @param port The port to check
 * @param force Whether to force-kill the process holding the port
 */
export async function ensurePortFree(port: number, force: boolean) {
  const available = await isPortAvailable(port);
  if (available) return;

  if (!force) {
    console.error(
      `[setup] Port ${port} is already in use. Something else may be running, ` +
        `or a previous dev session didn't shut down cleanly. ` +
        `Re-run with --force to kill whatever process is using it.`,
    );
    process.exit(1);
  }

  console.log(
    `[setup] Port ${port} in use, force-killing the process holding it...`,
  );
  killProcessOnPort(port);

  const stillTaken = !(await isPortAvailable(port));
  if (stillTaken) {
    console.error(`[setup] Failed to free port ${port}.`);
    process.exit(1);
  }
}

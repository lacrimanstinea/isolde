// this is independent of the ci/cd pipeline, it is for local builds only

import { run, ensureAndroidInit, ensureIcons } from "./utils";

type Target = "web" | "desktop" | "android" | "all";
type AndroidArch = "aarch64" | "armv7" | "x86_64" | "i686" | "aab" | "apk";

const target = Bun.argv[2] as Target | undefined;
const subArg = Bun.argv[3] as AndroidArch | undefined;

const validTargets = ["web", "desktop", "android", "all"];
const validAndroidArchs = ["aarch64", "armv7", "x86_64", "i686", "aab", "apk"];

if (!target || !validTargets.includes(target)) {
  console.error(
    "Usage: bun scripts/build.ts <web|desktop|android|all> [aarch64|armv7|x86_64|i686|aab|apk]",
  );
  process.exit(1);
}

if (target === "android" && subArg && !validAndroidArchs.includes(subArg)) {
  console.error(
    `Invalid Android target '${subArg}'. Valid choices: ${validAndroidArchs.join(", ")}`,
  );
  process.exit(1);
}

function buildWeb() {
  run("bun", ["--filter", "@isolde/app", "build"]);
}

function buildDesktop() {
  ensureIcons("release", true);
  run("bun", ["--filter", "@isolde/tauri", "tauri", "build"]);
}

function buildAndroid(typeOrArch?: AndroidArch) {
  ensureIcons("release", true);
  ensureAndroidInit();

  if (typeOrArch === "aab") {
    run("bun", ["--filter", "@isolde/tauri", "tauri", "android", "build"]);
    return;
  }

  const args = [
    "--filter",
    "@isolde/tauri",
    "tauri",
    "android",
    "build",
    "--apk",
  ];
  if (typeOrArch && typeOrArch !== "apk") {
    args.push("--target", typeOrArch);
  }

  run("bun", args);
}

switch (target) {
  case "web":
    buildWeb();
    break;
  case "desktop":
    buildDesktop();
    break;
  case "android":
    buildAndroid(subArg);
    break;
  case "all":
    buildWeb();
    buildDesktop();
    buildAndroid(); // universal .apk
    break;
}

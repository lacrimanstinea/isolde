// this is independent of the ci/cd pipeline, it is for local builds only

import { run, ensureAndroidInit, ensureIcons } from "./utils";

type Target = "desktop" | "android-aab" | "android-apk" | "all";

const target = Bun.argv[2] as Target | undefined;

if (
  !target ||
  !["desktop", "android-aab", "android-apk", "all"].includes(target)
) {
  console.error(
    "Usage: bun scripts/build.ts <desktop|android-aab|android-apk|all>",
  );
  process.exit(1);
}

function buildDesktop() {
  ensureIcons("release", true);
  run("bun", ["--filter", "@isolde/tauri", "tauri", "build"]);
}

function buildAndroidAab() {
  ensureIcons("release", true);
  ensureAndroidInit();
  run("bun", ["--filter", "@isolde/tauri", "tauri", "android", "build"]);
}

function buildAndroidApk() {
  ensureIcons("release", true);
  ensureAndroidInit();
  run("bun", [
    "--filter",
    "@isolde/tauri",
    "tauri",
    "android",
    "build",
    "--apk",
  ]);
}

switch (target) {
  case "desktop":
    buildDesktop();
    break;
  case "android-aab":
    buildAndroidAab();
    break;
  case "android-apk":
    buildAndroidApk();
    break;
  case "all":
    buildDesktop();
    buildAndroidAab();
    break;
}

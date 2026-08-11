import { platform as getTauriPlatform } from "@tauri-apps/plugin-os";
import { STORAGE_KEYS } from "./constants/storage";

export type SupportedPlatform =
  "windows" | "macos" | "linux" | "android" | "ios" | "web";

/*
 * Represents the platform information of the current environment
 * @property {SupportedPlatform} os - The operating system of the platform
 * @property {boolean} isDesktop - Whether the platform is a desktop environment
 * @property {boolean} isMobile - Whether the platform is a mobile environment
 * @property {boolean} isTauri - Whether the platform is a Tauri environment (use this to determine if you're on the web or tauri)
 */
export interface PlatformInfo {
  os: SupportedPlatform;
  isDesktop: boolean;
  isMobile: boolean;
  isTauri: boolean;
}

const STORAGE_KEY = STORAGE_KEYS.PLATFORM;

let memoryCache: PlatformInfo | null = null;

/**
 * Retrieves the platform information of the current environment
 * @returns {Promise<PlatformInfo>} A promise that resolves to the platform information
 */
export async function getPlatform(): Promise<PlatformInfo> {
  // try cache
  if (memoryCache) return memoryCache;

  // try session storage
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      memoryCache = JSON.parse(stored);
      return memoryCache!;
    }
  }

  // fallback get platform on the spot if nothing already saved
  const isTauri =
    typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
  let os: SupportedPlatform = "web";

  if (isTauri) {
    try {
      os = (await getTauriPlatform()) as SupportedPlatform;
    } catch {
      os = "web";
    }
  }

  const isMobile = os === "android" || os === "ios";
  const isDesktop = os === "windows" || os === "macos" || os === "linux";

  // update memory cache
  memoryCache = { os, isMobile, isDesktop, isTauri };

  // update session storage
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
  }

  return memoryCache;
}

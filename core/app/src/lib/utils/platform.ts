import { platform as getTauriPlatform } from '@tauri-apps/plugin-os';
import { STORAGE_KEYS } from './constants/storage';

export type SupportedPlatform = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'web';

export interface PlatformInfo {
  os: SupportedPlatform;
  isDesktop: boolean;
  isMobile: boolean;
  isTauri: boolean;
}

const STORAGE_KEY = STORAGE_KEYS.PLATFORM;

let memoryCache: PlatformInfo | null = null;

export async function getPlatform(): Promise<PlatformInfo> {
  // try cache
  if (memoryCache) return memoryCache;

  // try session storage
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      memoryCache = JSON.parse(stored);
      return memoryCache!;
    }
  }

  // fallback get platform on the spot if nothing already saved
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  let os: SupportedPlatform = 'web';

  if (isTauri) {
    try {
      os = (await getTauriPlatform()) as SupportedPlatform;
    } catch {
      os = 'web';
    }
  }

  const isMobile = os === 'android' || os === 'ios';

  // update memory cache
  memoryCache = {
    os,
    isMobile,
    isDesktop: isTauri && !isMobile,
    isTauri,
  };

  // update session storage
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memoryCache));
  }

  return memoryCache;
}

import { writable } from "svelte/store";
import { PREFS_KEYS } from "../utils/constants/storage";

function createBoolKey(key: string, defaultValue: boolean) {
  const stored =
    typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;

  const initial = stored === null ? defaultValue : stored === "true";

  const store = writable<boolean>(initial);

  store.subscribe((value) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, String(value));
    }
  });

  return store;
}

// i'll move this later into a different system to connect local prefs file and this, but for now it's fine
export const allowDesktopSwipe = createBoolKey(
  PREFS_KEYS.ALLOW_DESKTOP_SWIPE,
  true,
);
export const allowPullToRefreshDesktop = createBoolKey(
  PREFS_KEYS.ALLOW_PULL_TO_REFRESH_DESKTOP,
  false,
);

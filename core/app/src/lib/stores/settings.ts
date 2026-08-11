import { writable } from "svelte/store";
import { PREFS } from "../utils/constants/preferences";

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
  PREFS.BEHAVIOUR.ALLOW_DESKTOP_SWIPE.STORAGE_KEY,
  PREFS.BEHAVIOUR.ALLOW_DESKTOP_SWIPE.DEFAULT_VALUE,
);
export const allowPullToRefreshDesktop = createBoolKey(
  PREFS.BEHAVIOUR.ALLOW_PULL_TO_REFRESH_DESKTOP.STORAGE_KEY,
  PREFS.BEHAVIOUR.ALLOW_PULL_TO_REFRESH_DESKTOP.DEFAULT_VALUE,
);

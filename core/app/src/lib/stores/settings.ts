import { writable } from "svelte/store";
import { PREFS } from "@isolde/constants";
import { getStorageItem, setStorageItem } from "$lib/utils/stores/helper";

function createKey(key: string, defaultValue: boolean) {
  const stored = getStorageItem(key, defaultValue);
  const store = writable<boolean>(stored);

  store.subscribe((value) => {
    setStorageItem(key, value);
  });

  return store;
}

// i'll move this later into a different system to connect local prefs file and this, but for now it's fine
export const allowDesktopSwipe = createKey(
  PREFS.BEHAVIOUR.ALLOW_DESKTOP_SWIPE.STORAGE_KEY,
  PREFS.BEHAVIOUR.ALLOW_DESKTOP_SWIPE.DEFAULT_VALUE,
);
export const allowPullToRefreshDesktop = createKey(
  PREFS.BEHAVIOUR.ALLOW_PULL_TO_REFRESH_DESKTOP.STORAGE_KEY,
  PREFS.BEHAVIOUR.ALLOW_PULL_TO_REFRESH_DESKTOP.DEFAULT_VALUE,
);

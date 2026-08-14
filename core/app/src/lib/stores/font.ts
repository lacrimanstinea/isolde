import { writable } from "svelte/store";
import { PREFS } from "../../../../../shared/constants/src/constants/preferences";
import { setStorageItem, getStorageItem } from "$lib/utils/stores/helper";

const STORAGE_KEY = PREFS.CUSTOMIZATION.UI_FONT.STORAGE_KEY;
const DEFAULT_FONT = PREFS.CUSTOMIZATION.UI_FONT.DEFAULT_VALUE;

export const font = writable<string>(DEFAULT_FONT);

/**
 * Sets the custom font to the given value
 */
export function setFont(value: string) {
  font.set(value);
  setStorageItem(STORAGE_KEY, value);
  applyFont(value);
}

/**
 * Initializes the font store, loading the custom font from local storage
 */
export function initFont() {
  const stored = getStorageItem(STORAGE_KEY, DEFAULT_FONT) as string;
  font.set(stored);
  applyFont(stored);
}

/**
 * Resets the custom font to the default value
 */
export function resetFont() {
  setFont(DEFAULT_FONT);
}

/**
 * Applies the given font value
 */
function applyFont(value: string) {
  document.documentElement.style.setProperty(
    "--font-custom",
    `var(--font-${value})`,
  );
}

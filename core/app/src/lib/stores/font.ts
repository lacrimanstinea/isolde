import { writable } from "svelte/store";
import { PREFS } from "$lib/utils/constants/preferences";

const STORAGE_KEY = PREFS.CUSTOMIZATION.UI_FONT.STORAGE_KEY;
const DEFAULT_CUSTOM = PREFS.CUSTOMIZATION.UI_FONT.DEFAULT_VALUE;

export const fontCustom = writable<string>(DEFAULT_CUSTOM);

/**
 * Sets the custom font to the given value
 */
export function setFont(value: string) {
  fontCustom.set(value);
  localStorage.setItem(STORAGE_KEY, value);
  applyFont(value);
}

/**
 * Initializes the font store, loading the custom font from local storage
 */
export function initFont() {
  const stored = localStorage.getItem(STORAGE_KEY);
  const font = stored ?? DEFAULT_CUSTOM;
  if (!stored) return setFont(font);
  // if first time just set to default
  applyFont(font);
}

/**
 * Resets the custom font to the default value
 */
export function resetFont() {
  setFont(DEFAULT_CUSTOM);
}

/**
 * Applies the given font value
 */
function applyFont(value: string) {
  document.documentElement.style.setProperty("--font-custom", value);
}

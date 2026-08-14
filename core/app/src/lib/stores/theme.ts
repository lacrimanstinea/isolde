import { writable } from "svelte/store";
import { PREFS } from "../../../../../shared/constants/src/constants/preferences";
import { applyTheme, type ThemeOptions } from "@isolde/ui/colors";
import { getStorageItem, setStorageItem } from "$lib/utils/stores/helper";

const SEED_KEY = PREFS.COLORS.SEED_COLOR.STORAGE_KEY;
const DEFAULT_SEED = PREFS.COLORS.SEED_COLOR.DEFAULT_VALUE;

const CHROMA_KEY = PREFS.COLORS.CHROMA_MULTIPLIER.STORAGE_KEY;
const DEFAULT_CHROMA = PREFS.COLORS.CHROMA_MULTIPLIER.DEFAULT_VALUE;

const DARK_BG_KEY = PREFS.COLORS.DARK_BACKGROUND_BOOST.STORAGE_KEY;
const DEFAULT_DARK_BG = PREFS.COLORS.DARK_BACKGROUND_BOOST.DEFAULT_VALUE;

const LIGHTNESS_KEY = PREFS.COLORS.LIGHTNESS_SHIFT.STORAGE_KEY;
const DEFAULT_LIGHTNESS = PREFS.COLORS.LIGHTNESS_SHIFT.DEFAULT_VALUE;

const TINT_KEY = PREFS.COLORS.SURFACE_TINT_INTENSITY.STORAGE_KEY;
const DEFAULT_TINT = PREFS.COLORS.SURFACE_TINT_INTENSITY.DEFAULT_VALUE;

const HUE_KEY = PREFS.COLORS.HUE_SHIFT.STORAGE_KEY;
const DEFAULT_HUE = PREFS.COLORS.HUE_SHIFT.DEFAULT_VALUE;

const CONTRAST_KEY = PREFS.COLORS.CONTRAST_BOOST.STORAGE_KEY;
const DEFAULT_CONTRAST = PREFS.COLORS.CONTRAST_BOOST.DEFAULT_VALUE;

const MIN_CHROMA_KEY = PREFS.COLORS.MINIMUM_CHROMA.STORAGE_KEY;
const DEFAULT_MIN_CHROMA = PREFS.COLORS.MINIMUM_CHROMA.DEFAULT_VALUE;

const BLEND_KEY = PREFS.COLORS.SURFACE_BLEND.STORAGE_KEY;
const DEFAULT_BLEND = PREFS.COLORS.SURFACE_BLEND.DEFAULT_VALUE;

const LOCK_KEY = PREFS.COLORS.LOCK_ACCENT_TO_SEED.STORAGE_KEY;
const DEFAULT_LOCK = PREFS.COLORS.LOCK_ACCENT_TO_SEED.DEFAULT_VALUE;

const ELEVATION_KEY = PREFS.COLORS.ELEVATION_BOOST.STORAGE_KEY;
const DEFAULT_ELEVATION = PREFS.COLORS.ELEVATION_BOOST.DEFAULT_VALUE;

const THEME_KEY = PREFS.COLORS.THEME.STORAGE_KEY;
const DEFAULT_THEME = PREFS.COLORS.THEME.DEFAULT_VALUE;

const STORAGE_MAP: Record<keyof ThemeOptions, string> = {
  seedHex: SEED_KEY,
  theme: THEME_KEY,
  chromaMultiplier: CHROMA_KEY,
  darkBackgroundBoost: DARK_BG_KEY,
  lightnessShift: LIGHTNESS_KEY,
  surfaceTintIntensity: TINT_KEY,
  hueShift: HUE_KEY,
  contrastBoost: CONTRAST_KEY,
  minimumChroma: MIN_CHROMA_KEY,
  surfaceBlend: BLEND_KEY,
  lockAccentToSeed: LOCK_KEY,
  elevationBoost: ELEVATION_KEY,
};

function loadInitialTheme(): ThemeOptions {
  return {
    seedHex: (getStorageItem(SEED_KEY, DEFAULT_SEED) as string) ?? DEFAULT_SEED,
    chromaMultiplier:
      (getStorageItem(CHROMA_KEY, DEFAULT_CHROMA) as number) ?? DEFAULT_CHROMA,
    darkBackgroundBoost:
      (getStorageItem(DARK_BG_KEY, DEFAULT_DARK_BG) as number) ??
      DEFAULT_DARK_BG,
    lightnessShift:
      (getStorageItem(LIGHTNESS_KEY, DEFAULT_LIGHTNESS) as number) ??
      DEFAULT_LIGHTNESS,
    surfaceTintIntensity:
      (getStorageItem(TINT_KEY, DEFAULT_TINT) as number) ?? DEFAULT_TINT,
    hueShift: (getStorageItem(HUE_KEY, DEFAULT_HUE) as number) ?? DEFAULT_HUE,
    contrastBoost:
      (getStorageItem(CONTRAST_KEY, DEFAULT_CONTRAST) as number) ??
      DEFAULT_CONTRAST,
    elevationBoost:
      (getStorageItem(ELEVATION_KEY, DEFAULT_ELEVATION) as number) ??
      DEFAULT_ELEVATION,
    minimumChroma:
      (getStorageItem(MIN_CHROMA_KEY, DEFAULT_MIN_CHROMA) as number) ??
      DEFAULT_MIN_CHROMA,
    surfaceBlend:
      (getStorageItem(BLEND_KEY, DEFAULT_BLEND) as number) ?? DEFAULT_BLEND,
    lockAccentToSeed:
      (getStorageItem(LOCK_KEY, DEFAULT_LOCK) as boolean) ?? DEFAULT_LOCK,
    theme:
      (getStorageItem(THEME_KEY, DEFAULT_THEME) as "dark" | "light") ??
      DEFAULT_THEME,
  };
}

export const themeStore = writable<ThemeOptions>(loadInitialTheme());

export function setTheme(seedHex: string, options: ThemeOptions) {
  const newTheme = { seedHex, ...options };
  themeStore.set(newTheme);

  setStorageItem(SEED_KEY, seedHex);
  if (options.chromaMultiplier !== undefined)
    setStorageItem(CHROMA_KEY, options.chromaMultiplier);
  if (options.darkBackgroundBoost !== undefined)
    setStorageItem(DARK_BG_KEY, options.darkBackgroundBoost);
  if (options.lightnessShift !== undefined)
    setStorageItem(LIGHTNESS_KEY, options.lightnessShift);
  if (options.surfaceTintIntensity !== undefined)
    setStorageItem(TINT_KEY, options.surfaceTintIntensity);
  if (options.hueShift !== undefined) setStorageItem(HUE_KEY, options.hueShift);
  if (options.contrastBoost !== undefined)
    setStorageItem(CONTRAST_KEY, options.contrastBoost);
  if (options.minimumChroma !== undefined)
    setStorageItem(MIN_CHROMA_KEY, options.minimumChroma);
  if (options.surfaceBlend !== undefined)
    setStorageItem(BLEND_KEY, options.surfaceBlend);
  if (options.lockAccentToSeed !== undefined)
    setStorageItem(LOCK_KEY, options.lockAccentToSeed);
  if (options.theme !== undefined) setStorageItem(THEME_KEY, options.theme);

  applyTheme(newTheme);
}

export function updateThemeOption<K extends keyof ThemeOptions>(
  key: K,
  value: ThemeOptions[K],
) {
  if (value === undefined) return;

  themeStore.update((state) => {
    const updated = { ...state, [key]: value };

    setStorageItem(STORAGE_MAP[key], value);
    applyTheme(updated);
    return updated;
  });
}

export function initTheme() {
  const current = loadInitialTheme();
  applyTheme({ ...current });
}

export function toggleTheme() {
  const current = loadInitialTheme();
  applyTheme({ ...current });
}

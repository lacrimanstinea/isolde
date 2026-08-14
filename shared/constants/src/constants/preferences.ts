import { STORAGE_KEYS } from "./storage";
import {
  buildPrefs,
  type BuildPrefs,
  type PrefsSchema,
} from "../utils/buildPrefs";

// find font options in @isolde/ui/lib/data/fonts

// schema for the preferences storage
const PREFS_SCHEMA = {
  BEHAVIOUR: {
    ALLOW_DESKTOP_SWIPE: true,
    ALLOW_PULL_TO_REFRESH_DESKTOP: false,
  },
  CUSTOMIZATION: { UI_FONT: "elms" },
  COLORS: {
    THEME: "dark", // light / dark
    SEED_COLOR: "#ef5d93",
    CHROMA_MULTIPLIER: 1.7,
    DARK_BACKGROUND_BOOST: 0.15,
    LIGHTNESS_SHIFT: 0,
    SURFACE_TINT_INTENSITY: 0.25,
    HUE_SHIFT: 0,
    CONTRAST_BOOST: 0,
    MINIMUM_CHROMA: 0.025,
    SURFACE_BLEND: 0.05,
    ELEVATION_BOOST: 1.8,
    LOCK_ACCENT_TO_SEED: true,
  },
} as const satisfies PrefsSchema;

export const PREFS: BuildPrefs<
  typeof PREFS_SCHEMA,
  typeof STORAGE_KEYS.PREFERENCES
> = buildPrefs(PREFS_SCHEMA, STORAGE_KEYS.PREFERENCES);

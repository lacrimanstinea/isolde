import { STORAGE_KEYS } from "./storage";
import { buildPrefs, type BuildPrefs } from "../../utils/functions/buildPrefs";

/**
 * Font options for the custom font selector. (todo)
 */
export const FONT_OPTIONS = [
  { label: "System", value: "var(--font-system)" },
  { label: "Roboto", value: "var(--font-roboto)" },
  { label: "Instrument Sans", value: "var(--font-instrument)" },
  { label: "Inter", value: "var(--font-inter)" },
  { label: "DM Sans", value: "var(--font-dm-sans)" },
  { label: "Manrope", value: "var(--font-manrope)" },
  { label: "Plus Jakarta Sans", value: "var(--font-plus-jakarta)" },
  { label: "Lexend (dyslexia-friendly)", value: "var(--font-lexend)" },
  {
    label: "Atkinson Hyperlegible (accessibility)",
    value: "var(--font-atkinson)",
  },
  { label: "OpenDyslexic", value: "var(--font-opendyslexic)" },
];

// schema for the preferences storage
const PREFS_SCHEMA = {
  BEHAVIOUR: {
    ALLOW_DESKTOP_SWIPE: true,
    ALLOW_PULL_TO_REFRESH_DESKTOP: false,
  },
  CUSTOMIZATION: {
    //
    UI_FONT: "var(--font-system)",
  },
} as const;

export const PREFS: BuildPrefs<typeof PREFS_SCHEMA> = buildPrefs(
  PREFS_SCHEMA,
  STORAGE_KEYS.PREFERENCES,
);

import { STORAGE_KEYS } from "./storage";
import { buildPrefs, type BuildPrefs } from "../../utils/functions/buildPrefs";

// find font options in @isolde/ui/lib/data/fonts

// schema for the preferences storage
const PREFS_SCHEMA = {
  BEHAVIOUR: {
    ALLOW_DESKTOP_SWIPE: true,
    ALLOW_PULL_TO_REFRESH_DESKTOP: false,
  },
  CUSTOMIZATION: {
    //
    UI_FONT: "var(--font-elms)",
  },
} as const;

export const PREFS: BuildPrefs<typeof PREFS_SCHEMA> = buildPrefs(
  PREFS_SCHEMA,
  STORAGE_KEYS.PREFERENCES,
);

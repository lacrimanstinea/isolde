import {
  themeFromSourceColor,
  hexFromArgb,
} from "@material/material-color-utilities";
import { converter } from "culori";

const toOklch = converter("oklch");

export interface ThemeOptions {
  /** The theme mode to use (default: "dark") */
  theme?: "dark" | "light";
  /** The seed hex color used to generate the palette (default: "#ef5d93") */
  seedHex?: string;
  /** Multiplies the MD3 elevation overlay percentages, making elevated surfaces more/less distinct from the base (0.5 to 3, default: 1) */
  elevationBoost?: number;
  /** Scales the chroma (saturation/vibrancy) of all generated colors (0 to 3, default: 1.7) */
  chromaMultiplier?: number;
  /** Extra darkness shift applied to dark mode background (0 to 0.3, default: 0.12) */
  darkBackgroundBoost?: number;
  /** Forces a lighter or darker baseline lightness offset for the entire palette (-0.8 to 0.4, default: 0.15) */
  lightnessShift?: number;
  /** Adjusts how much surface colors blend with the seed hue (0 = pure neutral, 1 = full tint, default: 0.25) */
  surfaceTintIntensity?: number;
  /** Shifts the hue angle of the entire generated palette in degrees (-180 to 180, default: 0) */
  hueShift?: number;
  /** Increases or decreases contrast of primary elements by shifting lightness away from the middle (-0.1 to 0.1, default: 0) */
  contrastBoost?: number;
  /** Forces a minimum chroma floor for muted/border tokens so they don't look completely gray (0 to 0.1, default: 0.025) */
  minimumChroma?: number;
  /** Blends the seed color into all card and background surfaces (0 to 1, default: 0.05) */
  surfaceBlend?: number;
  /** Forces the accent and primary tokens to match the exact input hex (default: true) */
  lockAccentToSeed?: boolean;
}

interface ShadcnTokens {
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--popover": string;
  "--popover-foreground": string;
  "--primary": string;
  "--primary-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--border": string;
  "--input": string;
  "--ring": string;
  "--destructive": string;
  [elevationKey: `--elevation-${number}`]: string;
}

function rawHexToOklchString(hex: string): string {
  const color = toOklch(hex);
  if (!color) return "oklch(0 0 0)";
  return `oklch(${(color.l ?? 0).toFixed(3)} ${(color.c ?? 0).toFixed(3)} ${(color.h ?? 0).toFixed(1)})`;
}

function processColor(
  argbNumber: number,
  options: ThemeOptions,
  isBackground = false,
  isPrimary = false,
  seedHex = "#ef5d93", // default seed hex is just the platform default color
): string {
  const {
    chromaMultiplier = 1.7,
    darkBackgroundBoost = 0.12,
    lightnessShift = 0,
    surfaceTintIntensity = 0.25,
    hueShift = 0,
    contrastBoost = 0,
    minimumChroma = 0.025,
    surfaceBlend = 0.05,
  } = options;

  const hex = hexFromArgb(argbNumber);
  const color = toOklch(hex);
  if (!color) return "oklch(0 0 0)";

  let l = color.l ?? 0;
  let c = color.c ?? 0;
  let h = (color.h ?? 0) + hueShift;

  l += lightnessShift;

  if (isPrimary) {
    if (l > 0.5) l += contrastBoost;
    else l -= contrastBoost;
  }

  if (isBackground) {
    l -= darkBackgroundBoost;
    c *= surfaceTintIntensity;

    if (surfaceBlend > 0) {
      const seedColor = toOklch(seedHex);
      if (seedColor) {
        const blendFactor = Math.min(1, Math.max(0, surfaceBlend));
        h = h * (1 - blendFactor) + (seedColor.h ?? h) * blendFactor;
        c = Math.max(c, (seedColor.c ?? c) * blendFactor * 0.5);
      }
    }
  } else {
    c *= chromaMultiplier;
  }

  if (c < minimumChroma && c > 0) {
    c = minimumChroma;
  }

  l = Math.max(0, Math.min(1, l));
  c = Math.max(0, Math.min(0.4, c));

  return `oklch(${Number(l.toFixed(3))} ${Number(c.toFixed(3))} ${Number(h.toFixed(1))})`;
}

/**
 * Blends a surface color with the primary color at a given opacity —
 * mirrors MD3's elevation overlay system (surface tint).
 */
function elevationSurface(
  surfaceOklch: string,
  primaryOklch: string,
  overlayPercent: number,
): string {
  return `color-mix(in oklch, ${primaryOklch} ${overlayPercent}%, ${surfaceOklch})`;
}

/** MD3 elevation overlay percentages, levels 1-5 */
const ELEVATION_LEVELS: { level: number; overlay: number }[] = [
  { level: 1, overlay: 5 },
  { level: 2, overlay: 8 },
  { level: 3, overlay: 10 },
  { level: 4, overlay: 14 },
  { level: 5, overlay: 20 },
];

/**
 * Generates a shadcn ui tokens from a given seed hex color and the color options
 */
export function generateShadcnTokens(options: ThemeOptions = {}) {
  const resolvedOptions: ThemeOptions = {
    chromaMultiplier: 1.7,
    darkBackgroundBoost: 0.12,
    lightnessShift: 0,
    surfaceTintIntensity: 0.25,
    hueShift: 0,
    contrastBoost: 0,
    minimumChroma: 0.025,
    surfaceBlend: 0.05,
    lockAccentToSeed: true,
    seedHex: "#ef5d93",
    elevationBoost: 1,
    ...options,
  };

  const seedHex = resolvedOptions.seedHex!;
  const sourceNumber = parseInt(seedHex.replace("#", ""), 16);
  const theme = themeFromSourceColor(sourceNumber);

  const { light, dark } = theme.schemes;
  const exactOklch = rawHexToOklchString(seedHex);

  const lightTokens: ShadcnTokens = {
    "--background": processColor(
      light.background,
      resolvedOptions,
      true,
      false,
      seedHex,
    ),
    "--foreground": processColor(
      light.onBackground,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--card": processColor(
      light.surface,
      resolvedOptions,
      true,
      false,
      seedHex,
    ),
    "--card-foreground": processColor(
      light.onSurface,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--popover": processColor(
      light.surface,
      resolvedOptions,
      true,
      false,
      seedHex,
    ),
    "--popover-foreground": processColor(
      light.onSurface,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--primary": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(light.primary, resolvedOptions, false, true, seedHex),
    "--primary-foreground": processColor(
      light.onPrimary,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--secondary": processColor(
      light.secondaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--secondary-foreground": processColor(
      light.onSecondaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--muted": processColor(
      light.surfaceVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--muted-foreground": processColor(
      light.onSurfaceVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--accent": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(
          light.tertiaryContainer,
          resolvedOptions,
          false,
          false,
          seedHex,
        ),
    "--accent-foreground": processColor(
      light.onTertiaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--border": processColor(
      light.outlineVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--input": processColor(
      light.outlineVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--ring": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(light.primary, resolvedOptions, false, true, seedHex),
    "--destructive": processColor(
      light.error,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
  };

  const darkTokens: ShadcnTokens = {
    "--background": processColor(
      dark.background,
      resolvedOptions,
      true,
      false,
      seedHex,
    ),
    "--foreground": processColor(
      dark.onBackground,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--card": processColor(dark.surface, resolvedOptions, true, false, seedHex),
    "--card-foreground": processColor(
      dark.onSurface,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--popover": processColor(
      dark.surface,
      resolvedOptions,
      true,
      false,
      seedHex,
    ),
    "--popover-foreground": processColor(
      dark.onSurface,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--primary": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(dark.primary, resolvedOptions, false, true, seedHex),
    "--primary-foreground": processColor(
      dark.onPrimary,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--secondary": processColor(
      dark.secondaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--secondary-foreground": processColor(
      dark.onSecondaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--muted": processColor(
      dark.surfaceVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--muted-foreground": processColor(
      dark.onSurfaceVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--accent": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(
          dark.tertiaryContainer,
          resolvedOptions,
          false,
          false,
          seedHex,
        ),
    "--accent-foreground": processColor(
      dark.onTertiaryContainer,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--border": processColor(
      dark.outlineVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--input": processColor(
      dark.outlineVariant,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
    "--ring": resolvedOptions.lockAccentToSeed
      ? exactOklch
      : processColor(dark.primary, resolvedOptions, false, true, seedHex),
    "--destructive": processColor(
      dark.error,
      resolvedOptions,
      false,
      false,
      seedHex,
    ),
  };

  // md3-style elevation tokens
  const elevationBoost = resolvedOptions.elevationBoost ?? 1;

  for (const { level, overlay } of ELEVATION_LEVELS) {
    const boostedOverlay = Math.min(100, overlay * elevationBoost);

    lightTokens[`--elevation-${level}`] = elevationSurface(
      lightTokens["--card"],
      lightTokens["--primary"],
      boostedOverlay,
    );
    darkTokens[`--elevation-${level}`] = elevationSurface(
      darkTokens["--card"],
      darkTokens["--primary"],
      boostedOverlay,
    );
  }

  return { light: lightTokens, dark: darkTokens };
}

/**
 * Applies the theme to the document by setting CSS variables based on the color seed and extended options
 */
export function applyTheme(options: ThemeOptions = {}) {
  if (typeof document === "undefined") return;
  const tokens = generateShadcnTokens(options);
  const isDark = options.theme === "dark";
  const activeTokens = isDark ? tokens.dark : tokens.light;
  const classList = document.documentElement.classList;
  classList.toggle("dark", isDark);

  Object.entries(activeTokens).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

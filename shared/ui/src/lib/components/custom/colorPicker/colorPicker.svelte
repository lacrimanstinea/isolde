<script lang="ts">
  import type { Writable } from "svelte/store";
  import type { ThemeOptions } from "../../../colors";

  interface Props {
    themeStore: Writable<ThemeOptions>;
    updateThemeOption: <K extends keyof ThemeOptions>(
      key: K,
      value: ThemeOptions[K],
    ) => void;
    setTheme: (seedHex: string, options: ThemeOptions) => void;
  }

  let { themeStore, updateThemeOption, setTheme }: Props = $props();

  let hexInput = $derived($themeStore.seedHex);

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
      updateThemeOption("seedHex", value);
    }
  }

  function resetOptions() {
    setTheme("#ef5d93", {
      theme: "dark",
      elevationBoost: 1.8,
      chromaMultiplier: 1.7,
      darkBackgroundBoost: 0.15,
      lightnessShift: 0,
      surfaceTintIntensity: 0.25,
      hueShift: 0,
      contrastBoost: 0,
      minimumChroma: 0.025,
      surfaceBlend: 0.05,
      lockAccentToSeed: true,
    });
  }
</script>

<div
  class="bg-card text-card-foreground flex max-w-md flex-col gap-4 rounded-lg border p-4 shadow-sm"
>
  <div class="flex items-center gap-3">
    <label for="theme-picker" class="text-sm font-medium">Theme Seed:</label>

    <input
      id="theme-picker"
      type="color"
      value={$themeStore.seedHex}
      oninput={(e) => {
        const val = (e.target as HTMLInputElement).value;
        updateThemeOption("seedHex", val);
      }}
      class="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
    />

    <input
      type="text"
      value={hexInput}
      oninput={handleInput}
      maxlength="7"
      placeholder="#ef5d93"
      class="bg-background text-foreground focus:ring-ring w-28 rounded border px-3 py-1.5 text-xs focus:ring-2 focus:outline-none"
    />

    <button
      onclick={resetOptions}
      class="hover:bg-muted text-muted-foreground ml-auto rounded border px-2.5 py-1.5 text-xs transition-colors"
    >
      Reset
    </button>

    <button
      onclick={() =>
        updateThemeOption(
          "theme",
          $themeStore.theme === "dark" ? "light" : "dark",
        )}
      class="hover:bg-muted text-muted-foreground ml-auto rounded border px-2.5 py-1.5 text-xs transition-colors"
    >
      Switch
    </button>
  </div>

  <div class="border-border grid grid-cols-2 gap-3 border-t pt-3 text-xs">
    <!-- chroma multiplier -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="chroma-slider">Chroma</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.chromaMultiplier}</span
        >
      </div>
      <input
        id="chroma-slider"
        type="range"
        min="0"
        max="3"
        step="0.1"
        value={$themeStore.chromaMultiplier}
        oninput={(e) =>
          updateThemeOption(
            "chromaMultiplier",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- elevation boost -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="elevation-slider">Elevation</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.elevationBoost}</span
        >
      </div>
      <input
        id="elevation-slider"
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={$themeStore.elevationBoost}
        oninput={(e) =>
          updateThemeOption(
            "elevationBoost",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- dark background boost -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="dark-bg-slider">Dark BG Boost</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.darkBackgroundBoost}</span
        >
      </div>
      <input
        id="dark-bg-slider"
        type="range"
        min="-.8"
        max=".4"
        step="0.01"
        value={$themeStore.darkBackgroundBoost}
        oninput={(e) =>
          updateThemeOption(
            "darkBackgroundBoost",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- lightness shift -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="lightness-slider">Lightness Shift</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.lightnessShift}</span
        >
      </div>
      <input
        id="lightness-slider"
        type="range"
        min="-0.2"
        max="0.2"
        step="0.01"
        value={$themeStore.lightnessShift}
        oninput={(e) =>
          updateThemeOption(
            "lightnessShift",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- surface tint intensity -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="tint-slider">Surface Tint</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.surfaceTintIntensity}</span
        >
      </div>
      <input
        id="tint-slider"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={$themeStore.surfaceTintIntensity}
        oninput={(e) =>
          updateThemeOption(
            "surfaceTintIntensity",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- hue shift -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="hue-slider">Hue Shift (°)</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.hueShift}°</span
        >
      </div>
      <input
        id="hue-slider"
        type="range"
        min="-180"
        max="180"
        step="5"
        value={$themeStore.hueShift}
        oninput={(e) =>
          updateThemeOption(
            "hueShift",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- contrast -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="contrast-slider">Contrast Boost</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.contrastBoost}</span
        >
      </div>
      <input
        id="contrast-slider"
        type="range"
        min="-0.1"
        max="0.1"
        step="0.01"
        value={$themeStore.contrastBoost}
        oninput={(e) =>
          updateThemeOption(
            "contrastBoost",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- chroma -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="min-chroma-slider">Min Chroma</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.minimumChroma}</span
        >
      </div>
      <input
        id="min-chroma-slider"
        type="range"
        min="0"
        max="0.05"
        step="0.005"
        value={$themeStore.minimumChroma}
        oninput={(e) =>
          updateThemeOption(
            "minimumChroma",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- surface blend -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between">
        <label for="blend-slider">Surface Blend</label>
        <span class="text-muted-foreground font-sans"
          >{$themeStore.surfaceBlend}</span
        >
      </div>
      <input
        id="blend-slider"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={$themeStore.surfaceBlend}
        oninput={(e) =>
          updateThemeOption(
            "surfaceBlend",
            parseFloat((e.target as HTMLInputElement).value),
          )}
        class="accent-primary cursor-pointer"
      />
    </div>

    <!-- lock accent toggle -->
    <div
      class="border-border col-span-2 mt-1 flex items-center justify-between border-t pt-2"
    >
      <label for="lock-accent" class="cursor-pointer text-xs font-medium"
        >Lock Accent & Primary to Exact Hex</label
      >
      <input
        id="lock-accent"
        type="checkbox"
        checked={$themeStore.lockAccentToSeed}
        onchange={(e) =>
          updateThemeOption(
            "lockAccentToSeed",
            (e.target as HTMLInputElement).checked,
          )}
        class="cursor-pointer rounded"
      />
    </div>
  </div>
</div>

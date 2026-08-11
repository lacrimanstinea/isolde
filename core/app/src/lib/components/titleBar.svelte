<script lang="ts">
  import { getCurrentWindow } from "@tauri-apps/api/window";
  import { Minus, Diamond, X } from "lucide-svelte";
  import LogoText from "$lib/assets/logoText.svelte";
  const appWindow = getCurrentWindow();

  const appVersion = import.meta.env.VITE_APP_VERSION || "dev";
  const isRelease = import.meta.env.VITE_IS_RELEASE === "true";
  const typeOfRelease = import.meta.env.VITE_TYPE_OF_RELEASE || "preview";
</script>

<header
  data-tauri-drag-region
  class="bg-bg text-text flex h-8 items-center justify-between rounded-t-[10px] pr-1.5 pl-3 select-none"
>
  <!-- back/forward buttons that are invisible depending on the user's navigation history -->
  <div
    data-tauri-drag-region
    class="pointer-events-none flex h-3 w-auto items-center gap-2 opacity-80"
  >
    <LogoText />
    {#if !isRelease}
      <span class="font-elms text-xs text-white opacity-100"
        >{isRelease ? appVersion : appVersion + "-" + typeOfRelease}</span
      >
    {/if}
  </div>

  <!-- a search bar in the center that searches app wide -->

  <div class="flex h-full items-center gap-0.5">
    <button
      class="group hover:bg-text/10 active:bg-text/15 flex h-6 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-inherit opacity-55 transition-colors duration-150 hover:opacity-90"
      onclick={() => appWindow.minimize()}
      aria-label="Minimize"
    >
      <Minus
        size={12}
        strokeWidth={1.5}
        class="transition-transform duration-150 group-hover:scale-125"
      />
    </button>
    <button
      class="group hover:bg-text/10 active:bg-text/15 flex h-6 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-inherit opacity-55 transition-colors duration-150 hover:opacity-90"
      onclick={() => appWindow.toggleMaximize()}
      aria-label="Maximize"
    >
      <Diamond
        size={10}
        strokeWidth={1.5}
        class="transition-transform duration-150 group-hover:scale-125"
      />
    </button>
    <button
      class="group hover:bg-accent hover:text-bg flex h-6 w-7 cursor-pointer items-center justify-center rounded-md bg-transparent text-inherit opacity-55 transition-colors duration-150 hover:opacity-100"
      onclick={() => appWindow.close()}
      aria-label="Close"
    >
      <X
        size={12}
        strokeWidth={1.5}
        class="transition-transform duration-150 group-hover:scale-125"
      />
    </button>
  </div>
</header>

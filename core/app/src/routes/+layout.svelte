<script lang="ts">
  import "$lib/css/app.css";
  import { onMount } from "svelte";
  import TitleBar from "$lib/components/titleBar.svelte";
  import { platform, initPlatform } from "$lib/stores/platform";
  import { initFont } from "$lib/stores/font";
  import { initTheme } from "$lib/stores/theme";

  onMount(() => {
    initPlatform();
    initTheme();
    initFont();
  });

  let { children } = $props();
</script>

<div class="bg-bg text-text m-0 flex h-screen w-screen flex-col">
  {#if $platform?.isDesktop}
    <TitleBar />
  {/if}
  <main
    class="scro decoration-primary selection:bg-primary selection:text-bg primary-primary flex-1 overflow-auto px-3 font-sans"
    style={!$platform?.isDesktop
      ? `
            padding-top: max(0.5rem, env(safe-area-inset-top));
            padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
        `
      : ""}
  >
    {@render children()}
  </main>
</div>

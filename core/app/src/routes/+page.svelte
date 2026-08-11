<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { getPlatform, type PlatformInfo } from "$lib/utils/platform";
  let platform = $state<PlatformInfo | null>(null);

  // info gathered from build ci/cd
  const appVersion = import.meta.env.VITE_APP_VERSION || "dev";
  const isRelease = import.meta.env.VITE_IS_RELEASE === "true";
  const typeOfRelease = import.meta.env.VITE_TYPE_OF_RELEASE || "preview";

  onMount(async () => {
    platform = await getPlatform();
  });
</script>

<div class="flex min-h-full flex-col">
  <!-- stick to top -->
  <div>
    <h1 class="text-8xl">first official release</h1>
    <h2 class="text-accent text-9xl font-thin italic">
      {appVersion + (isRelease ? "" : "-" + typeOfRelease)}
    </h2>
    <p>i call it release, but it's just to test github actions really</p>
    <p>hello:)</p>
    <a href="https://github.com/lacrimanstinea/isolde">test link to repo</a> -
    does not open a separate browser window
    <br />
    <a href="https://github.com/lacrimanstinea/isolde" target="_blank"
      >open in new tab</a
    >
    - this does
    <p>
      <br />
    </p>
    <a class="text-accent underline" href={resolve("/library")}>
      go to test swipe navigation
    </a>
  </div>

  {#if platform?.isMobile}
    <!-- stick to bottom -->
    <div class="mt-auto pt-4">
      <p class="text-white underline opacity-35">
        this is some text at the bottom to test mobile nav bar thingy, it only
        shows on mobile though
      </p>
    </div>
  {/if}
</div>

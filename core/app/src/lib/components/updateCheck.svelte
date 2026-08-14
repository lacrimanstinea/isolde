<script lang="ts">
  import { onMount } from "svelte";
  import { check } from "@tauri-apps/plugin-updater";
  import { platform, initPlatform } from "$lib/stores/platform";

  let status = $state<"checking" | "up-to-date" | "available" | "error">(
    "checking",
  );
  let latestVersion = $state("");

  onMount(async () => {
    const info = $platform ?? (await initPlatform());
    if (!info.isDesktop || !info.isTauri) return;

    try {
      const update = await check();
      if (update) {
        latestVersion = update.version;
        status = "available";
      } else {
        status = "up-to-date";
      }
    } catch {
      status = "error";
    }
  });
</script>

{#if $platform?.isDesktop && $platform?.isTauri}
  <div class="text-muted-foreground text-sm">
    {#if status === "checking"}
      Checking for updates…
    {:else if status === "up-to-date"}
      You're on the latest version.
    {:else if status === "available"}
      Update available: v{latestVersion}
    {:else if status === "error"}
      Couldn't check for updates.
    {/if}
  </div>
{/if}

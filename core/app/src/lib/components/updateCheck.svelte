<script lang="ts">
  import { onMount } from "svelte";
  import { check, type Update } from "@tauri-apps/plugin-updater";
  import { relaunch } from "@tauri-apps/plugin-process";
  import { platform, initPlatform } from "$lib/stores/platform";

  let status = $state<
    "checking" | "up-to-date" | "available" | "downloading" | "ready" | "error"
  >("checking");
  let latestVersion = $state("");
  let progress = $state(0);
  let pendingUpdate: Update | null = null;

  onMount(async () => {
    const info = $platform ?? (await initPlatform());
    if (!info.isDesktop || !info.isTauri) return;
    try {
      const update = await check();
      if (update) {
        pendingUpdate = update;
        latestVersion = update.version;
        status = "available";
      } else {
        status = "up-to-date";
      }
    } catch {
      status = "error";
    }
  });

  async function installUpdate() {
    if (!pendingUpdate) return;
    status = "downloading";
    progress = 0;
    let downloaded = 0;
    let contentLength = 0;
    try {
      await pendingUpdate.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            contentLength = event.data.contentLength ?? 0;
            break;
          case "Progress":
            downloaded += event.data.chunkLength;
            if (contentLength) {
              progress = Math.round((downloaded / contentLength) * 100);
            }
            break;
          case "Finished":
            progress = 100;
            break;
        }
      });
      status = "ready";
    } catch {
      status = "error";
    }
  }

  async function restartNow() {
    await relaunch();
  }
</script>

{#if $platform?.isDesktop && $platform?.isTauri}
  <div class="text-muted-foreground flex flex-col gap-2 text-sm">
    {#if status === "checking"}
      Checking for updates…
    {:else if status === "up-to-date"}
      You're on the latest version.
    {:else if status === "available"}
      <div class="flex items-center gap-2">
        <span>Update available: v{latestVersion}</span>
        <button class="text-primary underline" onclick={installUpdate}>
          Download & Install
        </button>
      </div>
    {:else if status === "downloading"}
      <div class="flex flex-col gap-1">
        <span>Downloading update… {progress}%</span>
        <progress value={progress} max="100" class="w-full"></progress>
      </div>
    {:else if status === "ready"}
      <div class="flex items-center gap-2">
        <span>Update installed.</span>
        <button class="text-primary underline" onclick={restartNow}>
          Restart now
        </button>
      </div>
    {:else if status === "error"}
      Couldn't check for updates.
    {/if}
  </div>
{/if}

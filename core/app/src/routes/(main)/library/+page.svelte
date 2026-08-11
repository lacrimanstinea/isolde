<script lang="ts">
  import {
    allowDesktopSwipe,
    allowPullToRefreshDesktop,
  } from "$lib/stores/settings";
  import { platform } from "$lib/stores/platform";
</script>

<div>
  <div class="h-full w-full bg-red-500">
    <h1>Library</h1>
  </div>

  <div>
    allow desktop swipe: {$allowDesktopSwipe},<br />
    allow pull to refresh: {!$platform?.isMobile
      ? $allowPullToRefreshDesktop
      : true} <br />
    device: {$platform?.os}<br />
    isBrowser: {!$platform?.isTauri}<br />
  </div>
</div>

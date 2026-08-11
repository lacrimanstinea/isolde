<script lang="ts">
  import { page } from "$app/state";
  import { platform } from "$lib/stores/platform";
  import {
    allowDesktopSwipe,
    allowPullToRefreshDesktop,
  } from "$lib/stores/settings";
  import { routeIndex } from "$lib/utils/navigation";

  import Library from "./library/+page.svelte";
  import Updates from "./updates/+page.svelte";
  import History from "./history/+page.svelte";
  import Browse from "./browse/+page.svelte";
  import Settings from "./settings/+page.svelte";

  import { createNavigationGestures } from "$lib/utils/gestures/handlers";
  import type { GestureState } from "$lib/utils/gestures/types";

  const PAGES = [Library, Updates, History, Browse, Settings];

  let currentIndex = $derived(routeIndex(page.url.pathname));
  let isDesktop = $derived($platform?.isDesktop ?? true);
  let swipeEnabled = $derived(!isDesktop || $allowDesktopSwipe);
  let pullToRefreshEnabled = $derived(
    $platform?.isMobile || $allowPullToRefreshDesktop,
  );

  let containerEl = $state<HTMLDivElement | null>(null);
  let containerWidth = $state(1);

  // state for gestures in the navigation
  let currentGesturesState = $state<GestureState>({
    tracking: false,
    dragging: false,
    isHorizontalSwipe: false,
    isPullToRefresh: false,
    dragStartX: 0,
    dragStartY: 0,
    dragOffset: 0,
    pullDownOffset: 0,
    isRefreshing: false,
  });

  let refreshKeys = $state([0, 0, 0, 0, 0]);

  const handlers = createNavigationGestures({
    state: currentGesturesState,
    getIsDesktop: () => isDesktop,
    getSwipeEnabled: () => swipeEnabled,
    getPullToRefreshEnabled: () => pullToRefreshEnabled,
    getCurrentIndex: () => currentIndex,
    getContainerEl: () => containerEl,
    getContainerWidth: () => containerWidth,
    getCurrentPath: () => page.url.pathname,
    onRefreshComplete: (idx) => {
      refreshKeys[idx] += 1;
    },
  });
</script>

<div
  class={[
    $platform?.isMobile ? "py-3" : "",
    "flex h-full w-full overflow-hidden",
  ]}
>
  {#if !$platform?.isMobile}
    desktop navigation here
    <!-- <SidebarNav {currentIndex} routes={NAVIGATION_ROUTES} /> -->
  {/if}

  <div
    bind:this={containerEl}
    bind:clientWidth={containerWidth}
    class="relative flex-1 overflow-hidden select-none"
    role="region"
    aria-label="Swipeable page navigation"
    ontouchstart={handlers.handleTouchStart}
    ontouchmove={handlers.handleTouchMove}
    ontouchend={handlers.handleTouchEnd}
    ontouchcancel={handlers.handleTouchEnd}
    onpointerdown={handlers.handlePointerDown}
    onpointermove={handlers.handlePointerMove}
    onpointerup={handlers.handlePointerUp}
    onpointercancel={handlers.handlePointerUp}
  >
    {#if pullToRefreshEnabled}
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-30 -translate-x-1/2"
        style="
          transform: translate(-50%, {currentGesturesState.pullDownOffset > 0
          ? currentGesturesState.pullDownOffset - 48
          : -60}px);
          transition: {currentGesturesState.dragging
          ? 'none'
          : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'};
        "
      >
        <div class="text-text flex items-center justify-center">
          refresh icon here
        </div>
      </div>
    {/if}

    <div
      class="flex h-full w-full will-change-transform"
      style="
        transform: translate3d(calc({-currentIndex *
        100}% + {currentGesturesState.dragOffset}px), {currentGesturesState.pullDownOffset}px, 0);
        transition: {currentGesturesState.dragging
        ? 'none'
        : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'};
      "
    >
      {#each PAGES as PageComponent, i (i)}
        <div
          data-page-index={i}
          class={[
            $platform?.isMobile ? "" : "px-3",
            "h-full w-full shrink-0 overflow-y-auto",
          ]}
        >
          {#key refreshKeys[i]}
            <PageComponent />
          {/key}
        </div>
      {/each}
    </div>

    {#if $platform?.isMobile}
      <div class="absolute right-0 bottom-0 left-0">
        mobile test navigation here
        <!-- <BottomNav {currentIndex} routes={NAVIGATION_ROUTES} /> -->
      </div>
    {/if}
  </div>
</div>

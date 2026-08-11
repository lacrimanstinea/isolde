import { startGesture, moveGesture, endGesture } from "./gestures";
import { triggerRefresh } from "./refresh";
import type { NavigationGestureConfig } from "./types";

/**
 * Creates DOM event handler functions tailored for touch (mobile) and pointer (desktop) inputs.
 */
export function createNavigationGestures(config: NavigationGestureConfig) {
  const handleTriggerRefresh = () => {
    triggerRefresh(
      config.state,
      config.getCurrentIndex(),
      config.onRefreshComplete,
    );
  };

  return {
    // Mobile environment
    handleTouchStart(e: TouchEvent) {
      if (config.getIsDesktop() || e.touches.length !== 1) return;
      startGesture(
        e.touches[0].clientX,
        e.touches[0].clientY,
        config.state,
        config.getSwipeEnabled(),
        config.getCurrentIndex(),
        config.getCurrentPath(),
      );
    },

    handleTouchMove(e: TouchEvent) {
      if (config.getIsDesktop()) return;
      moveGesture(
        e.touches[0].clientX,
        e.touches[0].clientY,
        config.state,
        config.getCurrentIndex(),
        config.getContainerEl(),
        config.getPullToRefreshEnabled(),
        () => {
          if (e.cancelable) e.preventDefault();
        },
      );
    },

    handleTouchEnd() {
      if (config.getIsDesktop()) return;
      endGesture(
        config.state,
        config.getCurrentIndex(),
        config.getContainerWidth(),
        config.getIsDesktop(),
        config.getPullToRefreshEnabled(),
        handleTriggerRefresh,
      );
    },

    // Desktop environment
    handlePointerDown(e: PointerEvent) {
      if (!config.getIsDesktop() || e.button !== 0 || e.pointerType === "touch")
        return;
      if (
        startGesture(
          e.clientX,
          e.clientY,
          config.state,
          config.getSwipeEnabled(),
          config.getCurrentIndex(),
          config.getCurrentPath(),
        )
      ) {
        (e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId);
      }
    },

    handlePointerMove(e: PointerEvent) {
      if (!config.getIsDesktop() || e.pointerType === "touch") return;
      moveGesture(
        e.clientX,
        e.clientY,
        config.state,
        config.getCurrentIndex(),
        config.getContainerEl(),
        config.getPullToRefreshEnabled(),
      );
    },

    handlePointerUp(e: PointerEvent) {
      if (!config.getIsDesktop() || e.pointerType === "touch") return;
      (e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId);
      endGesture(
        config.state,
        config.getCurrentIndex(),
        config.getContainerWidth(),
        config.getIsDesktop(),
        config.getPullToRefreshEnabled(),
        handleTriggerRefresh,
      );
    },
  };
}

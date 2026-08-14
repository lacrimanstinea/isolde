import {
  startGesture,
  moveGesture,
  endGesture,
  cancelGesture,
} from "./gestures";
import { triggerRefresh } from "./refresh";
import type { NavigationGestureConfig } from "./types";

const INTERACTIVE_SELECTOR =
  "input, button, select, textarea, a, label, [role='button'], [contenteditable='true']";

function isInteractiveTarget(e: PointerEvent | TouchEvent): boolean {
  const target = e.target as HTMLElement | null;
  return !!target?.closest(INTERACTIVE_SELECTOR);
}

function hasActiveTextSelection(): boolean {
  const selection = window.getSelection?.();
  return (
    !!selection && !selection.isCollapsed && selection.toString().length > 0
  );
}

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
      if (
        config.getIsDesktop() ||
        e.touches.length !== 1 ||
        isInteractiveTarget(e)
      )
        return;
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
      if (hasActiveTextSelection()) {
        cancelGesture(config.state);
        return;
      }
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
      if (
        !config.getIsDesktop() ||
        e.button !== 0 ||
        e.pointerType === "touch" ||
        isInteractiveTarget(e)
      )
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
      if (hasActiveTextSelection()) {
        cancelGesture(config.state);
        return;
      }
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

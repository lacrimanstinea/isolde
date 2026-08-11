import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { NAVIGATION_ROUTES } from "$lib/utils/constants/routes";
import { type GestureState } from "./types";
import {
  SWIPE_RATIO,
  GESTURE_THRESHOLD,
  REFRESH_THRESHOLD,
} from "../constants/gestures";

/**
 * Retrieves the scrollable container element corresponding to the active page index.
 */
export function getActiveScrollable(
  containerEl: HTMLElement | null,
  currentIndex: number,
): HTMLElement | null {
  if (!containerEl) return null;
  return containerEl.querySelector(`[data-page-index="${currentIndex}"]`);
}

/**
 * Initializes gesture tracking state upon pointer or touch start.
 */
export function startGesture(
  x: number,
  y: number,
  state: GestureState,
  swipeEnabled: boolean,
  currentIndex: number,
  currentPath: string,
): boolean {
  if (!swipeEnabled || state.isRefreshing) return false;

  const route = NAVIGATION_ROUTES[currentIndex] ?? NAVIGATION_ROUTES[0];
  if (currentPath !== route && currentPath !== "/") return false;

  state.tracking = true;
  state.dragging = false;
  state.isHorizontalSwipe = false;
  state.isPullToRefresh = false;

  state.dragStartX = x;
  state.dragStartY = y;
  state.dragOffset = 0;
  state.pullDownOffset = 0;
  return true;
}

/**
 * Processes active movement coordinates, locking into horizontal page swiping
 * or vertical pull-to-refresh depending on direction and scroll position.
 */
export function moveGesture(
  x: number,
  y: number,
  state: GestureState,
  currentIndex: number,
  containerEl: HTMLElement | null,
  pullToRefreshEnabled: boolean,
  preventDefault?: () => void,
) {
  if (!state.tracking) return;

  const dx = x - state.dragStartX;
  const dy = y - state.dragStartY;

  const activeScroll = getActiveScrollable(containerEl, currentIndex);
  const isAtTop = activeScroll ? activeScroll.scrollTop <= 0 : true;

  if (!state.isHorizontalSwipe && !state.isPullToRefresh) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > GESTURE_THRESHOLD && absX > absY) {
      state.isHorizontalSwipe = true;
      state.dragging = true;
    } else if (
      pullToRefreshEnabled &&
      dy > GESTURE_THRESHOLD &&
      dy > absX &&
      isAtTop
    ) {
      state.isPullToRefresh = true;
      state.dragging = true;
    } else if (absY > GESTURE_THRESHOLD) {
      state.tracking = false;
      return;
    }
  }

  if (state.isHorizontalSwipe) {
    let next = dx;
    const isAtLeftBoundary = currentIndex === 0 && dx > 0;
    const isAtRightBoundary =
      currentIndex === NAVIGATION_ROUTES.length - 1 && dx < 0;

    if (isAtLeftBoundary || isAtRightBoundary) {
      next = dx * 0.3;
    }

    state.dragOffset = next;
  } else if (state.isPullToRefresh && pullToRefreshEnabled && isAtTop) {
    if (dy > 0) {
      if (preventDefault) preventDefault();
      state.pullDownOffset = Math.min(Math.pow(dy, 0.8), 90);
    } else {
      state.pullDownOffset = 0;
    }
  }
}

/**
 * Evaluates displacement at the end of an interaction, triggers route navigation,
 * initiates a pull refresh, or resets offsets back to zero.
 */
export function endGesture(
  state: GestureState,
  currentIndex: number,
  containerWidth: number,
  isDesktop: boolean,
  pullToRefreshEnabled: boolean,
  onTriggerRefresh: () => void,
) {
  if (!state.tracking) return;

  if (state.isHorizontalSwipe) {
    const exactPagesMoved = -state.dragOffset / containerWidth;

    const pageDelta = isDesktop
      ? Math.round(exactPagesMoved)
      : (() => {
          const absMoved = Math.abs(exactPagesMoved);
          const direction = Math.sign(exactPagesMoved);
          const fullPages = Math.floor(absMoved);
          const remainder = absMoved - fullPages;
          return direction * (fullPages + (remainder >= SWIPE_RATIO ? 1 : 0));
        })();

    const targetIndex = Math.min(
      Math.max(currentIndex + pageDelta, 0),
      NAVIGATION_ROUTES.length - 1,
    );

    if (targetIndex !== currentIndex) {
      goto(resolve(NAVIGATION_ROUTES[targetIndex]));
    }
  } else if (state.isPullToRefresh && pullToRefreshEnabled) {
    if (state.pullDownOffset >= REFRESH_THRESHOLD) {
      onTriggerRefresh();
    } else {
      state.pullDownOffset = 0;
    }
  }

  state.tracking = false;
  state.dragging = false;
  state.isHorizontalSwipe = false;
  state.isPullToRefresh = false;
  state.dragOffset = 0;
  if (!state.isRefreshing) state.pullDownOffset = 0;
}

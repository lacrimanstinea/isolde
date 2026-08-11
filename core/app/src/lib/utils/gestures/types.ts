/**
 * Active state of pointer/touch gestures
 * @property {boolean} tracking - Whether the gesture is currently being tracked
 * @property {boolean} dragging - Whether the gesture is currently being dragged
 * @property {boolean} isHorizontalSwipe - Whether the gesture is a horizontal swipe
 * @property {boolean} isPullToRefresh - Whether the gesture is a pull-to-refresh gesture
 * @property {number} dragStartX - The starting X coordinate of the drag
 * @property {number} dragStartY - The starting Y coordinate of the drag
 * @property {number} dragOffset - The current drag offset
 * @property {number} pullDownOffset - The current pull-down offset
 * @property {boolean} isRefreshing - Whether the gesture is currently refreshing
 */
export interface GestureState {
  tracking: boolean;
  dragging: boolean;
  isHorizontalSwipe: boolean;
  isPullToRefresh: boolean;
  dragStartX: number;
  dragStartY: number;
  dragOffset: number;
  pullDownOffset: number;
  isRefreshing: boolean;
}

/**
 * Configuration to connect event handlers to application state
 */
export interface NavigationGestureConfig {
  state: GestureState;
  getIsDesktop: () => boolean;
  getSwipeEnabled: () => boolean;
  getPullToRefreshEnabled: () => boolean;
  getCurrentIndex: () => number;
  getContainerEl: () => HTMLElement | null;
  getContainerWidth: () => number;
  getCurrentPath: () => string;
  onRefreshComplete: (index: number) => void;
}

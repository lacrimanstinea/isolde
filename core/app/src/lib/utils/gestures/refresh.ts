import { invalidateAll } from "$app/navigation";
import { type GestureState } from "./types";
import { REFRESH_THRESHOLD } from "../constants/gestures";

/**
 * The lil refresh thingy when u scroll up,
 * though it's specifically tailored to the main navigation for now,
 * i'll make it a reusable thing later when im not so lazy thx
 */
export async function triggerRefresh(
  state: GestureState,
  currentIndex: number,
  onRefreshComplete: (index: number) => void,
) {
  state.isRefreshing = true;
  state.dragging = false;
  state.pullDownOffset = REFRESH_THRESHOLD;

  try {
    await invalidateAll();
    onRefreshComplete(currentIndex);
  } finally {
    setTimeout(() => {
      state.pullDownOffset = 0;
    }, 250);

    setTimeout(() => {
      state.isRefreshing = false;
    }, 770);
  }
}

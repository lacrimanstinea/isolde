/**
 * The percentage of screen width required to swipe
 * before snapping to the next/previous page on mobile,
 * desktop works independently of this value because you can scroll multiple pages on more than one screen
 */
export const SWIPE_RATIO = 20 / 100;

/**
 * Minimum pixel movement threshold required to lock in a horizontal
 * swipe or vertical pull gesture and start tracking state
 */
export const GESTURE_THRESHOLD = 8;

/**
 * Pixel distance in pull-down height required to trigger a page refresh
 */
export const REFRESH_THRESHOLD = 60;

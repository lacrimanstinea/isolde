import { NAVIGATION_ROUTES } from "@isolde/constants";

/**
 * Returns the index of the route that matches the given pathname
 * This function is not a global, it is mainly for internal use within the navigation system inside the / paths
 *
 * @param pathname
 * @returns
 */
export function routeIndex(pathname: string): number {
  // matches '/library' and '/library/123' both to the 'library' index
  const idx = NAVIGATION_ROUTES.findIndex(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  return idx === -1 ? 0 : idx;
}

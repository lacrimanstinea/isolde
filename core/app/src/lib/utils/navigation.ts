import { NAVIGATION_ROUTES } from "./constants/routes.ts";

export function routeIndex(pathname: string): number {
  // matches '/library' and '/library/123' both to the 'library' index
  const idx = NAVIGATION_ROUTES.findIndex(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
  return idx === -1 ? 0 : idx;
}

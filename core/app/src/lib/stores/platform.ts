import { writable } from "svelte/store";
import { getPlatform, type PlatformInfo } from "$lib/utils/platform";

export const platform = writable<PlatformInfo | null>(null);

export async function initPlatform() {
  const info = await getPlatform();
  platform.set(info);
  return info;
}

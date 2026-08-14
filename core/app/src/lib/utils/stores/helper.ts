/*
 * Stores an item / updates it in the local storage with the given key and value
 */
export function setStorageItem(
  storageKey: string,
  value: boolean | string | number,
  // file?: string; // for tauri implementation to split into different files, will setup later
) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }
}

/*
 * Retrieves an item from local storage by its key. If nothing is stored yet,
 * writes and returns the given default value instead of leaving the key absent
 */
export function getStorageItem<T extends boolean | string | number>(
  storageKey: string,
  defaultValue: T,
): T {
  if (typeof localStorage === "undefined") return defaultValue;

  const raw = localStorage.getItem(storageKey);
  if (raw === null) {
    setStorageItem(storageKey, defaultValue);
    return defaultValue;
  }

  return JSON.parse(raw);
}

/*
 * Removes an item from the local storage by its key
 */
export function removeStorageItem(storageKey: string) {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(storageKey);
  }
}

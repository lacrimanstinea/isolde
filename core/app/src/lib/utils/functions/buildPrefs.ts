import { screamingSnakeToCamelCase } from "./casesUtility";

/**
 * Builds a prefs object from the schema, with storage keys and default values.
 *
 * in short it runs through the given shape (object), and takes out the key: value pairs,
 * and returns a prefs object with storage keys and default values, like so:
 *
 * ```
 * {
 *   key: {
 *     storage_key: `${prefix}_${category}_${screamingSnakeToCamelCase(key)}`,
 *     default: value,
 *   },
 * }
 * ```
 *
 *
 * @param shape The schema shape to build prefs from (see $lib/utils/constants/storage)
 * @param prefix The prefix to use for storage keys
 * @param category The category to use for storage keys
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPrefs<T extends Record<string, any>>(
  shape: T,
  prefix: string,
  category?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (const key in shape) {
    const value = shape[key];
    if (value !== null && typeof value === "object") {
      result[key] = buildPrefs(value, prefix, key);
    } else {
      result[key] = {
        STORAGE_KEY: `${prefix}_${category!.toLowerCase()}_${screamingSnakeToCamelCase(key)}`,
        DEFAULT_VALUE: value,
      };
    }
  }
  return result;
}

/**
 * Determines if a type is a an object or not.
 */
export type IsObject<T> = T extends object ? false : true;

/**
 * Builds a prefs object type from the schema.
 *
 * Example Return:
 *
 * ```
 * {
 *   key: {
 *     STORAGE_KEY: `${prefix}_${category}_${screamingSnakeToCamelCase(key)}`,
 *     DEFAULT_VALUE: value,
 *   },
 * }
 * ```
 */
export type BuildPrefs<T> = {
  [K in keyof T]: IsObject<T[K]> extends true
    ? { STORAGE_KEY: string; DEFAULT_VALUE: T[K] }
    : BuildPrefs<T[K]>;
};

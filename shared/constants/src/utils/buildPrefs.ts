import { screamingSnakeToCamelCase, type CamelCase } from "./casesUtility";

/**
 * Valid leaf value types for a prefs schema (i.e. what a preference is allowed to default to).
 */
type PrefsLeafValue = string | number | boolean;

/**
 * Constrains a schema shape passed to `buildPrefs` — every key must either be
 * a nested category (another PrefsSchema) or a leaf preference value.
 */
export type PrefsSchema = { [key: string]: PrefsLeafValue | PrefsSchema };

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

export function buildPrefs<T extends PrefsSchema>(
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
      console.log(`key: ${key}, value: ${typeof value} ${value}`);
      result[key] = {
        STORAGE_KEY: `${prefix}_${category!.toLowerCase()}_${screamingSnakeToCamelCase(key)}`,
        DEFAULT_VALUE: value,
      };
    }
  }
  return result;
}

/**
 * Determines if a type is a leaf value (not an object) or not.
 */
export type IsLeaf<T> = T extends object ? false : true;

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
export type BuildPrefs<
  Schema,
  Prefix extends string,
  Category extends string = "",
> = {
  [Key in keyof Schema]: IsLeaf<Schema[Key]> extends true
    ? {
        STORAGE_KEY: `${Prefix}_${Lowercase<Category>}_${CamelCase<Key & string>}`;
        DEFAULT_VALUE: Schema[Key];
      }
    : BuildPrefs<Schema[Key], Prefix, Key & string>;
};

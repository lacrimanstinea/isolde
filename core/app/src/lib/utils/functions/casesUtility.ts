// SCREAMING_SNAKE_CASE to camelCase, e.g. HELLO_THERE -> helloThere

/**
 * Converts a SCREAMING_SNAKE_CASE key to camelCase.
 *
 * @param text The text to convert
 * @returns string
 */
export function screamingSnakeToCamelCase(text: string): string {
  // this is for that stupid _ unused variable
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return text.toLowerCase().replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

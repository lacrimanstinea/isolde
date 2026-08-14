/**
 * Font options for the custom font selector. (todo)
 *
 * Label is the human-readable name of the font (e.g. "ELMS")
 * Value is the CSS variable name for the font (e.g. `var(--font-elms)`)
 */
export const FONT_OPTIONS = [
  { label: "ELMS", value: "var(--font-elms)" },
  // { label: "System", value: "var(--font-system)" }, // disabled because platforms don't really expose the system font to webview
  { label: "Roboto", value: "var(--font-roboto)" },
  { label: "Instrument Sans", value: "var(--font-instrument)" },
  { label: "Inter", value: "var(--font-inter)" },
  { label: "DM Sans", value: "var(--font-dm-sans)" },
  { label: "Manrope", value: "var(--font-manrope)" },
  { label: "Plus Jakarta Sans", value: "var(--font-plus-jakarta)" },
  { label: "Lexend (dyslexia-friendly)", value: "var(--font-lexend)" },
  {
    label: "Atkinson Hyperlegible (accessibility)",
    value: "var(--font-atkinson)",
  },
  { label: "OpenDyslexic", value: "var(--font-opendyslexic)" },
];

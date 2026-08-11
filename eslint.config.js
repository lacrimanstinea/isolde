import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ["**/*.svelte"],
    languageOptions: { parserOptions: { parser: ts.parser } },
  },
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["camelCase"] },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase"] },
        { selector: "import", format: null },
        { selector: "property", format: null },
      ],
    },
  },
  {
    ignores: [
      "**/.svelte-kit/**",
      "**/build/**",
      "**/node_modules/**",
      "**/static/**",
      "core/tauri/**",
    ],
  },
);

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import path from "node:path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
  },
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      precompress: false,
      strict: true,
    }),
    alias: {
      "@isolde/ui": path.resolve("../../shared/ui/src/lib"),
      "@isolde/constants": path.resolve("../../shared/constants/src"),
    },
  },
};

export default config;

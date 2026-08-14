import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: { alias: { "@ui-lib": path.resolve(__dirname, "./src/lib") } },
});

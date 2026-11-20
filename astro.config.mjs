// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://nextsociety.ieb.net",
  vite: { plugins: [tailwindcss()] },
});

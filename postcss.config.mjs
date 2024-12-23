import { radixThemePreset } from "radix-themes-tw";

/** @type {import('postcss-load-config').Config} */
const config = {
  presets: [radixThemePreset],
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;

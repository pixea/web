import type { Config } from "tailwindcss";
import tailwindCssAnimate from "tailwindcss-animate";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          1: "var(--gray-1)",
          2: "var(--gray-2)",
          3: "var(--gray-3)",
          4: "var(--gray-4)",
          5: "var(--gray-5)",
          6: "var(--gray-6)",
          7: "var(--gray-7)",
          8: "var(--gray-8)",
          9: "var(--gray-9)",
          10: "var(--gray-10)",
          11: "var(--gray-11)",
          12: "var(--gray-12)",
          a1: "var(--gray-a1)",
          a2: "var(--gray-a2)",
          a3: "var(--gray-a3)",
          a4: "var(--gray-a4)",
          a5: "var(--gray-a5)",
          a6: "var(--gray-a6)",
          a7: "var(--gray-a7)",
          a8: "var(--gray-a8)",
          a9: "var(--gray-a9)",
          a10: "var(--gray-a10)",
          a11: "var(--gray-a11)",
          a12: "var(--gray-a12)",
          surface: "var(--gray-surface)",
          indicator: "var(--gray-indicator)",
          track: "var(--gray-track)",
          contrast: "var(--gray-contrast)",
        },
        blue: {
          1: "var(--blue-1)",
          2: "var(--blue-2)",
          3: "var(--blue-3)",
          4: "var(--blue-4)",
          5: "var(--blue-5)",
          6: "var(--blue-6)",
          7: "var(--blue-7)",
          8: "var(--blue-8)",
          9: "var(--blue-9)",
          10: "var(--blue-10)",
          11: "var(--blue-11)",
          12: "var(--blue-12)",
          a1: "var(--blue-a1)",
          a2: "var(--blue-a2)",
          a3: "var(--blue-a3)",
          a4: "var(--blue-a4)",
          a5: "var(--blue-a5)",
          a6: "var(--blue-a6)",
          a7: "var(--blue-a7)",
          a8: "var(--blue-a8)",
          a9: "var(--blue-a9)",
          a10: "var(--blue-a10)",
          a11: "var(--blue-a11)",
          a12: "var(--blue-a12)",
          surface: "var(--blue-surface)",
          indicator: "var(--blue-indicator)",
          track: "var(--blue-track)",
          contrast: "var(--blue-contrast)",
        },
        pink: {
          1: "var(--pink-1)",
          2: "var(--pink-2)",
          3: "var(--pink-3)",
          4: "var(--pink-4)",
          5: "var(--pink-5)",
          6: "var(--pink-6)",
          7: "var(--pink-7)",
          8: "var(--pink-8)",
          9: "var(--pink-9)",
          10: "var(--pink-10)",
          11: "var(--pink-11)",
          12: "var(--pink-12)",
          a1: "var(--pink-a1)",
          a2: "var(--pink-a2)",
          a3: "var(--pink-a3)",
          a4: "var(--pink-a4)",
          a5: "var(--pink-a5)",
          a6: "var(--pink-a6)",
          a7: "var(--pink-a7)",
          a8: "var(--pink-a8)",
          a9: "var(--pink-a9)",
          a10: "var(--pink-a10)",
          a11: "var(--pink-a11)",
          a12: "var(--pink-a12)",
          surface: "var(--pink-surface)",
          indicator: "var(--pink-indicator)",
          track: "var(--pink-track)",
          contrast: "var(--pink-contrast)",
        },
        red: {
          1: "var(--red-1)",
          2: "var(--red-2)",
          3: "var(--red-3)",
          4: "var(--red-4)",
          5: "var(--red-5)",
          6: "var(--red-6)",
          7: "var(--red-7)",
          8: "var(--red-8)",
          9: "var(--red-9)",
          10: "var(--red-10)",
          11: "var(--red-11)",
          12: "var(--red-12)",
          a1: "var(--red-a1)",
          a2: "var(--red-a2)",
          a3: "var(--red-a3)",
          a4: "var(--red-a4)",
          a5: "var(--red-a5)",
          a6: "var(--red-a6)",
          a7: "var(--red-a7)",
          a8: "var(--red-a8)",
          a9: "var(--red-a9)",
          a10: "var(--red-a10)",
          a11: "var(--red-a11)",
          a12: "var(--red-a12)",
          surface: "var(--red-surface)",
          indicator: "var(--red-indicator)",
          track: "var(--red-track)",
          contrast: "var(--red-contrast)",
        },
        yellow: {
          1: "var(--yellow-1)",
          2: "var(--yellow-2)",
          3: "var(--yellow-3)",
          4: "var(--yellow-4)",
          5: "var(--yellow-5)",
          6: "var(--yellow-6)",
          7: "var(--yellow-7)",
          8: "var(--yellow-8)",
          9: "var(--yellow-9)",
          10: "var(--yellow-10)",
          11: "var(--yellow-11)",
          12: "var(--yellow-12)",
          a1: "var(--yellow-a1)",
          a2: "var(--yellow-a2)",
          a3: "var(--yellow-a3)",
          a4: "var(--yellow-a4)",
          a5: "var(--yellow-a5)",
          a6: "var(--yellow-a6)",
          a7: "var(--yellow-a7)",
          a8: "var(--yellow-a8)",
          a9: "var(--yellow-a9)",
          a10: "var(--yellow-a10)",
          a11: "var(--yellow-a11)",
          a12: "var(--yellow-a12)",
          surface: "var(--yellow-surface)",
          indicator: "var(--yellow-indicator)",
          track: "var(--yellow-track)",
          contrast: "var(--yellow-contrast)",
        },
        green: {
          1: "var(--green-1)",
          2: "var(--green-2)",
          3: "var(--green-3)",
          4: "var(--green-4)",
          5: "var(--green-5)",
          6: "var(--green-6)",
          7: "var(--green-7)",
          8: "var(--green-8)",
          9: "var(--green-9)",
          10: "var(--green-10)",
          11: "var(--green-11)",
          12: "var(--green-12)",
          a1: "var(--green-a1)",
          a2: "var(--green-a2)",
          a3: "var(--green-a3)",
          a4: "var(--green-a4)",
          a5: "var(--green-a5)",
          a6: "var(--green-a6)",
          a7: "var(--green-a7)",
          a8: "var(--green-a8)",
          a9: "var(--green-a9)",
          a10: "var(--green-a10)",
          a11: "var(--green-a11)",
          a12: "var(--green-a12)",
          surface: "var(--green-surface)",
          indicator: "var(--green-indicator)",
          track: "var(--green-track)",
          contrast: "var(--green-contrast)",
        },
        panel: {
          solid: "var(--color-panel-solid)",
        },
      },
      borderRadius: {
        1: "var(--radius-1)",
        2: "var(--radius-2)",
        3: "var(--radius-3)",
        4: "var(--radius-4)",
        5: "var(--radius-5)",
        6: "var(--radius-6)",
      },
      keyframes: {
        enterFromRight: {
          from: { opacity: "0", transform: "translateX(200px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        enterFromLeft: {
          from: { opacity: "0", transform: "translateX(-200px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        exitToRight: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(200px)" },
        },
        exitToLeft: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-200px)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "rotateX(-10deg) scale(0.9)" },
          to: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
        },
        scaleOut: {
          from: { opacity: "1", transform: "rotateX(0deg) scale(1)" },
          to: { opacity: "0", transform: "rotateX(-10deg) scale(0.95)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
    },
    animation: {
      scaleIn: "scaleIn 200ms ease",
      scaleOut: "scaleOut 200ms ease",
      fadeIn: "fadeIn 200ms ease",
      fadeOut: "fadeOut 200ms ease",
      enterFromLeft: "enterFromLeft 250ms ease",
      enterFromRight: "enterFromRight 250ms ease",
      exitToLeft: "exitToLeft 250ms ease",
      exitToRight: "exitToRight 250ms ease",
    },
    screens: {
      xs: "520px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1640px",
    },
  },
  plugins: [tailwindCssAnimate],
} satisfies Config;

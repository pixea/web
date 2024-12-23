import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "sk"],

  // Used when no locale matches
  defaultLocale: "en",

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    "/": {
      en: "/",
      sk: "/",
    },
    "/order": {
      en: "/order",
      sk: "/objednavka",
    },
    "/order/selection": {
      en: "/order/selection",
      sk: "/objednavka/vyber",
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

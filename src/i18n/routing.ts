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
    "/order/item": {
      en: "/order/item",
      sk: "/objednavka/polozka",
    },
    "/products": {
      en: "/products",
      sk: "/produkty",
    },
    "/product/photo-print": {
      en: "/product/photo-print",
      sk: "/produkt/tlac-fotografii",
    },
    "/product/photo-panels": {
      en: "/product/photo-panels",
      sk: "/produkt/fotopanely",
    },
    "/product/canvas-print": {
      en: "/product/canvas-print",
      sk: "/produkt/fotoplatna",
    },
    "/product/photo-magnets": {
      en: "/product/photo-magnets",
      sk: "/produkt/fotomagnetky",
    },
    "/about": {
      en: "/about",
      sk: "/o-nas",
    },
    "/contact": {
      en: "/contact",
      sk: "/kontakt",
    },
    "/auth": {
      en: "/auth",
      sk: "/auth",
    },
    "/auth/verify": {
      en: "/auth/verify",
      sk: "/auth/verify",
    },
    "/orders": {
      en: "/orders",
      sk: "/objednavky",
    },
    "/users": {
      en: "/users",
      sk: "/pouzivatelia",
    },
  },
});

export type AppPathnames = keyof (typeof routing)["pathnames"];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

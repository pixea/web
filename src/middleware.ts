import createMiddleware from "next-intl/middleware";
// import { NextMiddleware, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";
import { locales } from "./i18n/locales";

// export function stackMiddlewares(
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
//   functions: Function[] = [],
//   index = 0
// ): NextMiddleware {
//   const current = functions[index];
//   if (current) {
//     const next = stackMiddlewares(functions, index + 1);
//     return current(next);
//   }
//   return () => NextResponse.next();
// }

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const localizedPathnames = new Set(Object.keys(routing.pathnames));

  // Matches paths that start with a locale like '/en' or one of localized paths
  const shouldHandle =
    localizedPathnames.has(pathname) ||
    new RegExp(`^/(${locales.join("|")})(/.*)?$`).test(
      request.nextUrl.pathname
    );

  if (!shouldHandle) return;

  return handleI18nRouting(request);
}

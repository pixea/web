import createMiddleware from "next-intl/middleware";
// import { NextMiddleware, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";

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

const routingMiddleware = createMiddleware(routing);

export const middleware = routingMiddleware;

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(sk|en)/:path*"],
};

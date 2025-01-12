import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse, userAgent } from "next/server";

import { routing } from "@/i18n/routing";
import { locales } from "@/i18n/locales";
import { cookies } from "next/headers";

async function cartMiddleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;

  const { isBot } = userAgent(request);

  const isOrder = Object.entries(routing.pathnames["/order"]).some(
    ([lang, route]) => pathname.startsWith(`/${lang}${route}`)
  );

  // No need to handle cart for non-order pages
  if (!isOrder) return;

  const cookieStore = await cookies();

  const currentCartId = cookieStore.get("cartId")?.value;

  const cartId = currentCartId
    ? currentCartId
    : isBot
      ? // Bots get a single stable cart ID
        "534f68b0-b001-b001-b001-e93e5fbe3aab"
      : crypto.randomUUID();

  cookieStore.set({
    name: "cartId",
    value: cartId,
    maxAge: 60 * 60 * 24 * 31,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
}

const handleI18nRouting = createMiddleware(routing);

function i18nMiddleware(request: NextRequest) {
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

const middlewares: Array<(req: NextRequest) => Promise<unknown> | unknown> = [
  cartMiddleware,
  i18nMiddleware,
];

export default async function middleware(request: NextRequest) {
  // if a response is returned, return it otherwise call `next()`
  for (const fn of middlewares) {
    const response = await fn(request);
    if (response) {
      return response;
    }
  }

  return NextResponse.next();
}

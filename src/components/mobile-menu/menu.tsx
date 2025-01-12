"use client";

import { useCallback, useState } from "react";
import {
  Flex,
  Box,
  Button,
  Text,
  Theme,
  Separator,
  Badge,
} from "@radix-ui/themes";
import { ShoppingBagIcon as EmptyShoppingBagIcon } from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  ShoppingBagIcon as FullShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Session } from "next-auth";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";
import { Link } from "@/i18n/routing";
import { MenuItem } from "@/app/[locale]/header";
import themeConfig from "@/app/_themes/config";

import MobileSubMenu from "./submenu";
import MobileAccountMenu from "./account";
import useAuthUrl from "@/hooks/useAuthUrl";

const MobileMenu = ({
  session,
  items,
  cartItemCount,
}: {
  session?: Session | null;
  items: readonly MenuItem[];
  cartItemCount: number;
}) => {
  const t = useTranslations("Header");
  const authUrl = useAuthUrl();
  const [open, setOpen] = useState(false);

  const onInteraction = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          color="gray"
          size="3"
          title={t("menu")}
          className="p-3 text-gray-10"
        >
          <Bars3Icon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full xs:w-96">
        <SheetHeader className="text-left">
          <Box className="mb-7">
            <Link href="/" title={"home"} onClick={onInteraction}>
              <Image
                src="/brand/logo-light.svg"
                alt=""
                width={120}
                height={40}
                className="block dark:hidden"
              />
              <Image
                src="/brand/logo-dark.svg"
                alt=""
                width={120}
                height={40}
                className="hidden dark:block"
              />
            </Link>
          </Box>

          <SheetTitle className="sr-only text-gray-10">{t("menu")}</SheetTitle>
        </SheetHeader>

        <Theme {...themeConfig}>
          <Flex direction="column" className="mt-4" asChild>
            <ul className="gap-5">
              {items.map((item) =>
                "items" in item ? (
                  <li key={item.name}>
                    <MobileSubMenu item={item} onInteraction={onInteraction} />
                  </li>
                ) : (
                  <li key={item.name} className="flex">
                    <Button
                      variant="ghost"
                      color="gray"
                      className="py-2 w-full justify-start"
                      asChild
                    >
                      <Link
                        href={item.href}
                        className="rounded-3"
                        onClick={onInteraction}
                      >
                        <Text size="4" className="font-semibold">
                          {t(item.name)}
                        </Text>
                      </Link>
                    </Button>
                  </li>
                )
              )}

              <li>
                <Button
                  variant="soft"
                  color="blue"
                  size="4"
                  className="relative w-full font-semibold"
                  asChild
                >
                  <Link href="/order" className="flex items-center gap-1.5">
                    {cartItemCount === 0 ? (
                      <>
                        <EmptyShoppingBagIcon className="size-5" /> {t("order")}
                      </>
                    ) : (
                      <>
                        <FullShoppingBagIcon className="size-5" />
                        {t("openOrder")}
                        <Badge
                          variant="solid"
                          radius="full"
                          color="blue"
                          size="2"
                          className="absolute -top-1.5 -right-1"
                        >
                          {cartItemCount}
                        </Badge>
                      </>
                    )}
                  </Link>
                </Button>
              </li>

              <Separator orientation="horizontal" className="w-full" />

              {session ? (
                <li>
                  <MobileAccountMenu
                    session={session}
                    onInteraction={onInteraction}
                  />
                </li>
              ) : (
                <li>
                  <Button
                    variant="soft"
                    color="gray"
                    className="w-full font-semibold"
                    size="4"
                    asChild
                  >
                    <Link href={authUrl} onClick={onInteraction}>
                      {t("login")}
                    </Link>
                  </Button>
                </li>
              )}
            </ul>
          </Flex>
        </Theme>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

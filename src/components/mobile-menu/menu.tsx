"use client";

import { useCallback, useState } from "react";
import { Flex, Box, Button, Text, Theme, Separator } from "@radix-ui/themes";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet";

import themeConfig from "@/app/_themes/config";
import MobileSubMenu from "./submenu";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { MenuItem } from "@/app/[locale]/header";

const MobileMenu = ({ items }: { items: readonly MenuItem[] }) => {
  const t = useTranslations("Header");
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
      <SheetContent className="w-full">
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
                  className="py-6 w-full"
                  asChild
                >
                  <Link
                    href="/order"
                    className="rounded-3"
                    onClick={onInteraction}
                  >
                    <Text size="4" className="font-semibold">
                      {t("order")}
                    </Text>
                  </Link>
                </Button>
              </li>

              <Separator className="w-full" />

              <li>
                <Button
                  variant="soft"
                  color="gray"
                  className="py-6 w-full"
                  asChild
                >
                  <Link
                    href="/auth"
                    className="rounded-3"
                    onClick={onInteraction}
                  >
                    <Text size="4" className="font-semibold">
                      {t("login")}
                    </Text>
                  </Link>
                </Button>
              </li>
            </ul>
          </Flex>
        </Theme>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

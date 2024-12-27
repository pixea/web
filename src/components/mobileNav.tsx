"use client";

import React from "react";

import { Link } from "@/i18n/routing";
import Image from "next/image";

import { Flex, Box, Button, Text, Theme } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";

import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import { MenuItem } from "@/app/[locale]/header";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

import { useTranslations } from "next-intl";
import themeConfig from "@/app/_themes/config";

const MobileNavigation = ({ items }: { items: MenuItem[] }) => {
  const t = useTranslations("Header");

  // Collapsible
  const [open, setOpen] = React.useState(false);

  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      className="w-full md:hidden"
    >
      <Link href="/" aria-label={t("home")}>
        <Image
          src="/brand/icon-light.svg"
          alt=""
          width={32}
          height={40}
          className="block dark:hidden"
        />
        <Image
          src="/brand/icon-dark.svg"
          alt=""
          width={32}
          height={40}
          className="hidden dark:block"
        />
      </Link>

      <Flex gap="3">
        <Button
          variant="soft"
          size="3"
          className="relative font-semibold"
          asChild
        >
          <Link href="/order">
            {t("order")}

            {/* <Box
      position="absolute"
      top="0"
      right="0"
      className="bg-blue-solid"
    >
      1
    </Box> */}
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              color="gray"
              size="3"
              aria-label={t("menu")}
              className="p-3 text-gray-10"
            >
              <Bars3Icon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full">
            <SheetHeader className="text-left">
              <Box className="mb-7">
                <Link href="/">
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

              <SheetTitle className="hidden text-gray-10">Navigácia</SheetTitle>
            </SheetHeader>

            <Theme {...themeConfig}>
              <Flex direction="column" className="mt-4" asChild>
                <ul className="gap-5">
                  {items.map((item) =>
                    "items" in item ? (
                      <li key={item.name}>
                        <Collapsible.Root open={open} onOpenChange={setOpen}>
                          <Collapsible.Trigger asChild>
                            <Button
                              variant="ghost"
                              color="blue"
                              className="py-2 gap-1.5 w-full justify-start"
                            >
                              <Text size="4" className="font-semibold">
                                {t(item.name)}
                              </Text>
                              {open ? (
                                <ChevronUpIcon className="size-5" />
                              ) : (
                                <ChevronDownIcon className="size-5" />
                              )}
                            </Button>
                          </Collapsible.Trigger>

                          <Collapsible.Content>
                            <Flex direction="column" className="mt-5" asChild>
                              <ul className="gap-5 ml-5">
                                {item.items.map((subItem) => (
                                  <li key={subItem.name}>
                                    <Button
                                      variant="ghost"
                                      color="blue"
                                      className="py-2 w-full justify-start"
                                      asChild
                                    >
                                      <Link href={subItem.href}>
                                        <Text size="4">{t(subItem.name)}</Text>
                                      </Link>
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </Flex>
                          </Collapsible.Content>
                        </Collapsible.Root>
                      </li>
                    ) : (
                      <li key={item.name} className="flex">
                        <Button
                          variant="ghost"
                          color="blue"
                          className="py-2 w-full justify-start"
                          asChild
                        >
                          <Link href={item.href} className="rounded-3">
                            <Text size="4" className="font-semibold">
                              {t(item.name)}
                            </Text>
                          </Link>
                        </Button>
                      </li>
                    )
                  )}

                  <li>
                    <Button variant="soft" color="blue" className="py-6 w-full">
                      <Link href="/order" className="rounded-3">
                        <Text size="4" className="font-semibold">
                          {t("order")}
                        </Text>
                      </Link>
                    </Button>
                  </li>
                </ul>
              </Flex>
            </Theme>
          </SheetContent>
        </Sheet>
      </Flex>
    </Flex>
  );
};

export default MobileNavigation;

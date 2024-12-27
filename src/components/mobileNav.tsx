"use client";

import React from "react";

import { Link } from "@/i18n/routing";
import Image from "next/image";

import { Flex, Box, Button, Text, Theme } from "@radix-ui/themes";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Popover from "@radix-ui/react-popover";

import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import { UserIcon } from "@heroicons/react/24/outline";

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
        {/* <Button variant="outline" color="gray" size="3" asChild>
          <Popover.Root>
            <Popover.Trigger asChild>
              <button
                className="inline-flex items-center justify-center"
                aria-label="Update dimensions"
              >
                <UserIcon className="size-5" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                sideOffset={5}
              >
                <div className="flex flex-col gap-2.5">
                  <p className="mb-2.5 text-[15px] font-medium leading-[19px] text-mauve12">
                    Dimensions
                  </p>
                  <fieldset className="flex items-center gap-5">
                    <label
                      className="w-[75px] text-[13px] text-violet11"
                      htmlFor="width"
                    >
                      Width
                    </label>
                    <input
                      className="inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      id="width"
                      defaultValue="100%"
                    />
                  </fieldset>
                  <fieldset className="flex items-center gap-5">
                    <label
                      className="w-[75px] text-[13px] text-violet11"
                      htmlFor="maxWidth"
                    >
                      Max. width
                    </label>
                    <input
                      className="inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      id="maxWidth"
                      defaultValue="300px"
                    />
                  </fieldset>
                  <fieldset className="flex items-center gap-5">
                    <label
                      className="w-[75px] text-[13px] text-violet11"
                      htmlFor="height"
                    >
                      Height
                    </label>
                    <input
                      className="inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      id="height"
                      defaultValue="25px"
                    />
                  </fieldset>
                  <fieldset className="flex items-center gap-5">
                    <label
                      className="w-[75px] text-[13px] text-violet11"
                      htmlFor="maxHeight"
                    >
                      Max. height
                    </label>
                    <input
                      className="inline-flex h-[25px] w-full flex-1 items-center justify-center rounded px-2.5 text-[13px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                      id="maxHeight"
                      defaultValue="none"
                    />
                  </fieldset>
                </div>
                <Popover.Close
                  className="absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center rounded-full text-violet11 outline-none hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
                  aria-label="Close"
                >
                  <XMarkIcon />
                </Popover.Close>
                <Popover.Arrow className="fill-white" />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </Button> */}

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

                  <Box className="border-t border-gray-4"></Box>

                  <li>
                    <Button variant="soft" color="gray" className="py-6 w-full">
                      <Link href="/auth" className="rounded-3">
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
      </Flex>
    </Flex>
  );
};

export default MobileNavigation;

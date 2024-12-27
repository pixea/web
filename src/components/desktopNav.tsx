import React from "react";

import { Link } from "@/i18n/routing";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { Flex, Button, Theme } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { MenuItem } from "@/app/[locale]/header";

import { useTranslations } from "next-intl";
import themeConfig from "@/app/_themes/config";

const DesktopNavigation = ({ items }: { items: MenuItem[] }) => {
  const t = useTranslations("Header");

  return (
    <Flex
      direction="row"
      align="center"
      justify="between"
      className="hidden md:flex w-full"
    >
      <Link href="/" aria-label={t("home")} className="lg:hidden">
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

      <Link href="/" aria-label={t("home")} className="hidden lg:block">
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

      <NavigationMenu.Root className="relative z-10 flex w-screen justify-center">
        <NavigationMenu.List className="center m-0 flex list-none rounded-3 gap-6 p-1">
          {items.map((item) =>
            "items" in item ? (
              <NavigationMenu.Item key={item.name}>
                <Button
                  variant="ghost"
                  color="gray"
                  size="2"
                  className="w-full font-medium py-2.5"
                  asChild
                >
                  <NavigationMenu.Trigger className="group flex select-none items-center gap-1 px-3 py-2 leading-none outline-none">
                    {t(item.name)}
                    <ChevronDownIcon
                      className="size-3 relative top-px transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                      aria-hidden
                    />
                  </NavigationMenu.Trigger>
                </Button>

                <NavigationMenu.Content className="absolute left-0 top-0 w-full data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
                  <Theme {...themeConfig}>
                    <ul className="one m-0 grid list-none gap-x-2.5 p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                      <li className="row-span-3 grid">
                        <NavigationMenu.Link asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gray-5 p-[25px] no-underline outline-none"
                            href="/"
                          >
                            <svg
                              aria-hidden
                              width="38"
                              height="38"
                              viewBox="0 0 25 25"
                              fill="black"
                            >
                              <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
                              <path d="M12 0H4V8H12V0Z"></path>
                              <path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
                            </svg>
                            <div className="mb-[7px] mt-4 text-[18px] font-medium leading-[1.2] text-gray-12">
                              Radix Primitives
                            </div>
                            <p className="text-[14px] leading-[1.3] text-gray-10">
                              Unstyled, accessible components for React.
                            </p>
                          </Link>
                        </NavigationMenu.Link>
                      </li>

                      <ListItem href="https://stitches.dev/" title="Stitches">
                        CSS-in-JS with best-in-class developer experience.
                      </ListItem>
                      <ListItem href="/colors" title="Colors">
                        Beautiful, thought-out palettes with auto dark mode.
                      </ListItem>
                      <ListItem
                        href="https://icons.radix-ui.com/"
                        title="Icons"
                      >
                        A crisp set of 15x15 icons, balanced and consistent.
                      </ListItem>
                    </ul>
                  </Theme>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : (
              <NavigationMenu.Item key={item.name}>
                <Button
                  variant="ghost"
                  color="gray"
                  size="2"
                  className="w-full font-medium py-2.5"
                  asChild
                >
                  <NavigationMenu.Link
                    className="block select-none rounded px-3 py-2 text-[15px] font-medium leading-none text-violet11 no-underline outline-none hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-violet7"
                    href={item.href}
                  >
                    {t(item.name)}
                  </NavigationMenu.Link>
                </Button>
              </NavigationMenu.Item>
            )
          )}

          <NavigationMenu.Indicator className="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
            <div className="relative top-[70%] size-2.5 rotate-45 rounded-tl-sm bg-white" />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
          <NavigationMenu.Viewport className="relative mt-2.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md bg-white transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
        </div>
      </NavigationMenu.Root>

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
    </Flex>
  );
};

const ListItem = React.forwardRef(
  ({ className, children, title, ...props }, forwardedRef) => (
    <li>
      <NavigationMenu.Link asChild>
        <Link
          className={cn(
            "block select-none rounded-md p-3 text-[15px] leading-none no-underline outline-none transition-colors hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-violet7",
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          <div className="mb-[5px] font-medium leading-[1.2] text-violet12">
            {title}
          </div>
          <p className="leading-[1.4] text-mauve11">{children}</p>
        </Link>
      </NavigationMenu.Link>
    </li>
  )
);

export default DesktopNavigation;

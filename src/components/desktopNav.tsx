import { forwardRef, ReactNode } from "react";

import { AppPathnames, Link } from "@/i18n/routing";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { Flex, Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { MenuItem } from "@/app/[locale]/header";

import { useTranslations } from "next-intl";
import DesktopLink from "./desktopLink";

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
                <NavigationMenu.Trigger className="group flex select-none items-center gap-1 px-3 py-2 leading-none outline-none">
                  {t(item.name)}
                  <ChevronDownIcon
                    className="size-3 relative top-px transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>

                <NavigationMenu.Content className="absolute left-0 top-0 w-full data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
                  <ul className="one flex flex-col m-0 list-none gap-x-2.5 p-[22px] sm:w-[500px] sm:grid-cols-[0.75fr_1fr]">
                    <ListItem href="https://stitches.dev/" title="Stitches">
                      CSS-in-JS with best-in-class developer experience.
                    </ListItem>
                    <ListItem href="/colors" title="Colors">
                      Beautiful, thought-out palettes with auto dark mode.
                    </ListItem>
                    <ListItem href="https://icons.radix-ui.com/" title="Icons">
                      A crisp set of 15x15 icons, balanced and consistent.
                    </ListItem>
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : (
              <NavigationMenu.Item key={item.name}>
                <DesktopLink href={item.href}>{t(item.name)}</DesktopLink>
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

const ListItem = forwardRef<
  HTMLAnchorElement,
  { className: string; href: AppPathnames; children: ReactNode; title: string }
>(({ className, children, title, ...props }, forwardedRef) => (
  <li>
    <DesktopLink
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
    </DesktopLink>
  </li>
));
ListItem.displayName = "ListItem";

export default DesktopNavigation;

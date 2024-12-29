import { forwardRef, ReactNode } from "react";
import { Flex, Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { Session } from "next-auth";

import { MenuItem } from "@/app/[locale]/header";
import { AppPathnames, Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { accountItems } from "@/components/accountItems";

import DesktopLink from "./desktopLink";
import Personalized from "./personalized";
import { useTranslations } from "next-intl";

const DesktopNavigation = ({
  session,
  items,
}: {
  session?: Session | null;
  items: readonly MenuItem[];
}) => {
  const t = useTranslations("Header");

  return (
    <Flex
      direction="row"
      align="center"
      justify="between"
      className="hidden sm:flex w-full"
    >
      <Link href="/" title={t("home")} className="lg:hidden">
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

      <Link href="/" title={t("home")} className="hidden lg:block">
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

      <NavigationMenu.Root className="relative z-10 flex justify-center">
        <NavigationMenu.List className="center m-0 flex list-none rounded-3 gap-6 p-1">
          {items.map((item) =>
            "items" in item ? (
              <NavigationMenu.Item key={item.name}>
                <Button variant="ghost" color="gray" size="3" asChild>
                  <NavigationMenu.Trigger className="group flex select-none items-center gap-1 py-2.5 leading-none outline-none">
                    {t(item.name)}
                    <ChevronDownIcon
                      className="size-3 relative top-px transition-transform duration-250 ease-in group-data-[state=open]:-rotate-180"
                      aria-hidden
                    />
                  </NavigationMenu.Trigger>
                </Button>

                <NavigationMenu.Content className="bg-gray-3 dark:bg-gray-4 absolute left-0 top-0 w-full data-[motion=from-end]:animate-enterFromRight data-[motion=from-start]:animate-enterFromLeft data-[motion=to-end]:animate-exitToRight data-[motion=to-start]:animate-exitToLeft sm:w-auto">
                  <ul className="one flex flex-col m-0 list-none gap-2 p-1.5 w-96">
                    {item.items.map((subItem) => (
                      <ListItem
                        key={subItem.name}
                        href={subItem.href}
                        title={t(subItem.name)}
                        className="hover:bg-gray-2 dark:hover:bg-gray-6"
                      >
                        Desc
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : (
              <NavigationMenu.Item key={item.name}>
                <Button variant="ghost" color="gray" size="3" asChild>
                  <DesktopLink href={item.href}>{t(item.name)}</DesktopLink>
                </Button>
              </NavigationMenu.Item>
            )
          )}

          <NavigationMenu.Indicator className="top-full z-10 flex h-2.5 items-end justify-center overflow-hidden transition-[width,transform_250ms_ease] data-[state=hidden]:animate-fadeOut data-[state=visible]:animate-fadeIn">
            <div className="relative top-3/4 size-2.5 rotate-45 rounded-tl-sm bg-gray-3 dark:bg-gray-4" />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>

        <div className="perspective-[2000px] absolute left-0 top-full flex w-full justify-center">
          <NavigationMenu.Viewport className="relative mt-2.5 h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-md bg-gray-4 transition-[width,_height] duration-300 data-[state=closed]:animate-scaleOut data-[state=open]:animate-scaleIn sm:w-[var(--radix-navigation-menu-viewport-width)]" />
        </div>
      </NavigationMenu.Root>

      <Flex direction="row" align="center" gap="4">
        <Personalized session={session} items={accountItems} />
      </Flex>
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

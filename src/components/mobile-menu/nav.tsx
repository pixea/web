import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Flex, Button, Badge } from "@radix-ui/themes";
import { ShoppingBagIcon as EmptyShoppingBagIcon } from "@heroicons/react/24/outline";
import { ShoppingBagIcon as FullShoppingBagIcon } from "@heroicons/react/24/solid";

import { Session } from "next-auth";

import { MenuItem } from "@/app/[locale]/header";
import { Link } from "@/i18n/routing";

import MobileMenu from "./menu";

const MobileNavigation = ({
  session,
  items,
  cartItemCount,
}: {
  session?: Session | null;
  items: readonly MenuItem[];
  cartItemCount: number;
}) => {
  const t = useTranslations("Header");

  return (
    <Flex
      direction="row"
      justify="between"
      align="center"
      className="w-full md:hidden"
    >
      <Link href="/" title={t("home")}>
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
          color="blue"
          size="3"
          className="relative font-semibold"
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
                  className="absolute -top-1.5 -right-1"
                >
                  {cartItemCount}
                </Badge>
              </>
            )}
          </Link>
        </Button>

        <MobileMenu
          items={items}
          session={session}
          cartItemCount={cartItemCount}
        />
      </Flex>
    </Flex>
  );
};

export default MobileNavigation;

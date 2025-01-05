import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Flex, Button } from "@radix-ui/themes";

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
      className="w-full sm:hidden"
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

        <MobileMenu items={items} session={session} />
      </Flex>
    </Flex>
  );
};

export default MobileNavigation;

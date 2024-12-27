import React from "react";

import { Link } from "@/i18n/routing";
import Image from "next/image";

import { Flex, Button } from "@radix-ui/themes";

import { MenuItem } from "@/app/[locale]/header";

import { useTranslations } from "next-intl";
import MobileMenu from "./menu";

const MobileNavigation = ({ items }: { items: readonly MenuItem[] }) => {
  const t = useTranslations("Header");

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

        <MobileMenu items={items} />
      </Flex>
    </Flex>
  );
};

export default MobileNavigation;

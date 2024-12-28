"use client";

import { Link } from "@/i18n/routing";
import {
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

const Personalized = () => {
  const t = useTranslations("Header");

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            color="gray"
            size="3"
            className="py-2.5"
            title={t("account")}
          >
            <UserIcon className="size-5" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>{t("account")}</DropdownMenu.Item>
          <DropdownMenu.Item>{t("orders")}</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>{t("products")}</DropdownMenu.Item>
          <DropdownMenu.Item>{t("users")}</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <ArrowLeftEndOnRectangleIcon className="size-4" />{" "}
          <DropdownMenu.Item color="red">{t("logout")}</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

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
    </>
  );
};

export default Personalized;

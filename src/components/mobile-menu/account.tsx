"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Separator, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { logout } from "@/app/[locale]/auth/actions";

import { Link } from "@/i18n/routing";
import { AccountMenuItem } from "@/components/accountItems";
import {
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const MobileAccountMenu = ({
  items,
  onInteraction,
}: {
  items: readonly AccountMenuItem[];
  onInteraction: () => void;
}) => {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);

  const iconSize = 4;

  const renderableItems = items.filter((item) => item !== "SEPARATOR");

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button variant="soft" color="gray" className="py-6 gap-1.5 w-full">
          <UserCircleIcon className="size-6" />
          <Text size="4" className="font-semibold">
            {t("accountItems.account")}
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
            {renderableItems.map((subItem) => (
              <li key={subItem.name}>
                <Button
                  variant="ghost"
                  color={"color" in subItem ? subItem.color : "gray"}
                  className="py-2 w-full justify-start"
                  asChild
                >
                  <Link
                    href={subItem.href}
                    onClick={onInteraction}
                    className="gap-1.5"
                  >
                    {subItem.icon ? (
                      <subItem.icon className={`size-${iconSize}`} />
                    ) : null}{" "}
                    <Text size="4">{t(subItem.name)}</Text>
                  </Link>
                </Button>
              </li>
            ))}

            <Separator orientation="horizontal" className="w-full" />

            <li>
              <form action={logout}>
                <Button
                  variant="ghost"
                  color="red"
                  className="py-2 w-full justify-start gap-1.5"
                  onClick={onInteraction}
                  type="submit"
                >
                  <ArrowLeftEndOnRectangleIcon className={`size-${iconSize}`} />
                  <Text size="4">{t("logout")}</Text>
                </Button>
              </form>
            </li>
          </ul>
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default MobileAccountMenu;

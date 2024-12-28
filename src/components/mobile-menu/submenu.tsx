"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MenuItem } from "@/app/[locale]/header";

const MobileSubMenu = ({
  item,
  onInteraction,
}: {
  item: MenuItem;
  onInteraction: () => void;
}) => {
  const t = useTranslations("Header");
  const [open, setOpen] = useState(false);

  if ("items" in item === false) return null;

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <Button
          variant="ghost"
          color="gray"
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
                  color="gray"
                  className="py-2 w-full justify-start"
                  asChild
                >
                  <Link href={subItem.href} onClick={onInteraction}>
                    <Text size="4">{t(subItem.name)}</Text>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default MobileSubMenu;

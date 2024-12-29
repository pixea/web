import { Link } from "@/i18n/routing";
// TODO: Use i18n Link once DropdownItem is fixed
import NextLink from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { logout } from "@/app/[locale]/auth/actions";
import { AccountMenuItem } from "@/app/[locale]/header";

const Personalized = ({
  session,
  items,
}: {
  session?: Session | null;
  items: readonly AccountMenuItem[];
}) => {
  const t = useTranslations("Header");

  const accountButton = (
    <Button
      variant="ghost"
      color="gray"
      size="3"
      className="py-2.5"
      title={t("accountItems.account")}
      asChild
    >
      <Link href="/auth">
        <UserCircleIcon className="size-5" />
      </Link>
    </Button>
  );

  const accountMenuIconSize = 4;

  const accountDropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          color="gray"
          size="3"
          className="py-2.5"
          title={t("accountItems.account")}
        >
          <UserCircleIcon className="size-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item, index) =>
          item === "SEPARATOR" ? (
            <DropdownMenu.Separator key={"Separator" + index} />
          ) : "color" in item ? (
            <DropdownMenu.Item key={item.name} color={item.color} asChild>
              <NextLink href={item.href}>
                <item.icon className={`size-${accountMenuIconSize}`} />{" "}
                {t(item.name)}
              </NextLink>
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Item key={item.name} asChild>
              <NextLink href={item.href}>
                <item.icon className={`size-${accountMenuIconSize}`} />{" "}
                {t(item.name)}
              </NextLink>
            </DropdownMenu.Item>
          )
        )}

        <DropdownMenu.Separator />

        <form action={logout}>
          <DropdownMenu.Item color="red" asChild>
            <button type="submit">
              <ArrowLeftEndOnRectangleIcon className="size-4" /> {t("logout")}
            </button>
          </DropdownMenu.Item>
        </form>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  return (
    <>
      {session ? accountDropdown : accountButton}

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

import { Link } from "@/i18n/routing";
// TODO: Use i18n Link once DropdownItem is fixed
import NextLink from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  ShoppingBagIcon as EmptyShoppingBagIcon,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon,
  ShoppingBagIcon as FullShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { Button, DropdownMenu, Tooltip, Badge, Flex } from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { logoutAction } from "@/app/[locale]/auth/actions";
import useAccountItems from "@/hooks/useAccountItems";
import useAuthUrl from "@/hooks/useAuthUrl";

const Personalized = ({
  session,
  cartItemCount,
}: {
  session?: Session | null;
  cartItemCount: number;
}) => {
  const t = useTranslations("Header");
  const items = useAccountItems(session);
  const authUrl = useAuthUrl();

  const name = session?.user?.name;
  const firstLetter = name ? Array.from(name)[0].toUpperCase() : undefined;
  const role = session?.user.role;

  const accountButton = (
    <Tooltip content={t("login")}>
      <Button
        variant="ghost"
        color="gray"
        size="3"
        radius="full"
        className="p-2.5"
        asChild
      >
        <Link href={authUrl}>
          <UserCircleIcon className="size-5" />
        </Link>
      </Button>
    </Tooltip>
  );

  const accountMenuIconSize = 4;

  const accountDropdown = (
    <DropdownMenu.Root>
      <Tooltip content={t("manageAccount")}>
        <DropdownMenu.Trigger className="w-10">
          <Button
            variant="solid"
            color={role === "admin" ? "yellow" : "pink"}
            size="3"
            radius="full"
          >
            {firstLetter ? firstLetter : <UserCircleIcon className="size-5" />}
          </Button>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Content>
        {items.map((item, index) =>
          item === "SEPARATOR" ? (
            <DropdownMenu.Separator key={"Separator" + index} />
          ) : (
            <DropdownMenu.Item
              key={item.name}
              color={"color" in item ? item.color : undefined}
              asChild
            >
              <NextLink href={item.href}>
                <item.icon className={`size-${accountMenuIconSize}`} />{" "}
                {t(item.name)}
              </NextLink>
            </DropdownMenu.Item>
          )
        )}

        <DropdownMenu.Separator />

        <form action={logoutAction}>
          <DropdownMenu.Item color="red" className="w-full" asChild>
            <button type="submit">
              <ArrowLeftEndOnRectangleIcon className="size-4" /> {t("logout")}
            </button>
          </DropdownMenu.Item>
        </form>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );

  return (
    <Flex direction="row" align="center" gap={name ? "3" : "5"}>
      {session ? accountDropdown : accountButton}

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
    </Flex>
  );
};

export default Personalized;

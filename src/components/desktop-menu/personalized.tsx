import { Link } from "@/i18n/routing";
// TODO: Use i18n Link once DropdownItem is fixed
import NextLink from "next/link";
import {
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
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

  const role = session?.user.role;

  const accountButton = (
    <Tooltip content={t("login")}>
      <Button variant="ghost" color="gray" size="3" className="py-2.5" asChild>
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
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            color={role === "admin" ? "yellow" : "gray"}
            size="3"
            className="py-2.5"
            title={t("accountItems.account")}
          >
            <UserCircleIcon className="size-5" />
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

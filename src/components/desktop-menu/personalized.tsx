import { Link } from "@/i18n/routing";
// TODO: Use i18n Link once DropdownItem is fixed
import NextLink from "next/link";
import {
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { signOut } from "@/auth";

const Personalized = ({ session }: { session?: Session | null }) => {
  const t = useTranslations("Header");

  const accountButton = (
    <Button
      variant="ghost"
      color="gray"
      size="3"
      className="py-2.5"
      title={t("account")}
      asChild
    >
      <Link href="/auth">
        <UserCircleIcon className="size-5" />
      </Link>
    </Button>
  );

  const accountDropdown = (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          color="gray"
          size="3"
          className="py-2.5"
          title={t("account")}
        >
          <UserCircleIcon className="size-5" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <NextLink href="/auth">
            <UserIcon className="size-4" /> {t("account")}
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <NextLink href="/orders">
            <ShoppingBagIcon className="size-4" /> {t("orders")}
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="yellow" asChild>
          <NextLink href="/products">
            <Squares2X2Icon className="size-4" /> {t("products")}
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Item color="yellow" asChild>
          <NextLink href="/users">
            <UserGroupIcon className="size-4" /> {t("users")}
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />

        <form
          action={async () => {
            "use server";

            await signOut();
          }}
        >
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

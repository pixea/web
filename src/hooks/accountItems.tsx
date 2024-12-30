import {
  UserIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";
import { JSX } from "react";

import { User } from "@/db/schema";
import { DropdownMenu } from "@radix-ui/themes";
import { AppPathnames } from "@/i18n/routing";

// Account menu items
const accountItems = [
  { name: "accountItems.account", icon: UserIcon, href: "/auth?tab=profile" },
  {
    name: "accountItems.orders",
    icon: ShoppingBagIcon,
    href: "/auth?tab=orders",
    role: ["customer"],
  },
  "SEPARATOR",
  {
    name: "accountItems.orders",
    icon: ShoppingBagIcon,
    href: "/orders",
    role: ["admin"],
  },
  {
    name: "accountItems.products",
    icon: Squares2X2Icon,
    href: "/products",
    role: ["admin"],
  },
  {
    name: "accountItems.users",
    icon: UserGroupIcon,
    href: "/users",
    role: ["admin"],
  },
] as Array<"SEPARATOR" | AccountMenuItem>;

// TODO: Is there a better type? Looks like a literal union in their code.
type Color = DropdownMenu.ItemProps["color"];

type AccountMenuItem = {
  name: string;
  icon: JSX.ElementType;
  href: AppPathnames;
  color?: Color;
  role?: User["role"][];
};

const useAccountItems = <T extends boolean>(
  session?: Session | null,
  includeSeparators = true as T
) => {
  const role = session?.user?.role;

  const wantedItems = accountItems
    .filter((item) => {
      if (item === "SEPARATOR") return includeSeparators;

      const allowedRoles = item.role;

      if (!allowedRoles) return true;

      return role && allowedRoles.includes(role);
    })
    .map((item) =>
      item === "SEPARATOR"
        ? item
        : {
            ...item,
            color:
              item.role && item.role.includes("admin")
                ? ("yellow" as Color)
                : undefined,
          }
    );

  const withoutUnwantedSeparators = wantedItems.reduce<
    (AccountMenuItem | "SEPARATOR")[]
  >((acc, item, index) => {
    const isSeparator = item === "SEPARATOR";

    // Remove separators at the beginning and end
    if (isSeparator && (index === 0 || index === wantedItems.length - 1)) {
      return acc;
    }

    // Remove separators that are followed by another separator
    const prevIsSeparator = acc.length && acc[acc.length - 1] === "SEPARATOR";
    if (isSeparator && prevIsSeparator) {
      return acc;
    }

    acc.push(item);
    return acc;
  }, []);

  return withoutUnwantedSeparators as T extends false
    ? AccountMenuItem[]
    : (AccountMenuItem | "SEPARATOR")[];
};

export default useAccountItems;

import { User } from "@/db/schema";
import {
  UserIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Session } from "next-auth";

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
] as Array<
  | "SEPARATOR"
  | {
      name: string;
      icon: unknown;
      href: string;
      role?: User["role"][];
    }
>;

export type AccountMenuItem = (typeof accountItems)[number];

const useAccountItems = (
  session?: Session | null,
  includeSeparators = true
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
              item.role && item.role.includes("admin") ? "yellow" : undefined,
          }
    );

  const withoutUnwantedSeparators = wantedItems.reduce<AccountMenuItem[]>(
    (acc, item, index) => {
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
    },
    []
  );

  return withoutUnwantedSeparators;
};

export default useAccountItems;

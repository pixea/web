import {
  UserIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Account menu items
export const accountItems = [
  { name: "accountItems.account", icon: UserIcon, href: "/auth" },
  { name: "accountItems.orders", icon: ShoppingBagIcon, href: "/orders" },
  "SEPARATOR",
  {
    name: "accountItems.products",
    icon: Squares2X2Icon,
    href: "/products",
    color: "yellow",
  },
  {
    name: "accountItems.users",
    icon: UserGroupIcon,
    href: "/users",
    color: "yellow",
  },
] as const;

export type AccountMenuItem = (typeof accountItems)[number];

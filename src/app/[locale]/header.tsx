import { Flex } from "@radix-ui/themes";

// Mobile and desktop navigation
import MobileNavigation from "@/components/mobileNav";
import DesktopNavigation from "@/components/desktopNav";

// Navigation menu items
const menu = [
  { name: "items.photo", href: "/product/photo-print" },
  { name: "items.panel", href: "/product/photo-panels" },
  { name: "items.canvas", href: "/product/canvas-print" },
  {
    name: "items.other",
    items: [
      { name: "items.magnets", href: "/product/photo-magnets" },
      { name: "items.magnets", href: "/product/photo-magnets" },
      { name: "items.magnets", href: "/product/photo-magnets" },
    ],
  },
  { name: "items.about", href: "/about" },
  { name: "items.contact", href: "/contact" },
] as const;

export type MenuItem = (typeof menu)[number];

const Header = () => {
  return (
    <Flex
      position="sticky"
      top="0"
      direction="row"
      justify="between"
      align="center"
      gap="3"
      p="4"
      className="bg-panel-solid z-10"
      asChild
    >
      <header>
        <MobileNavigation items={menu} />

        <DesktopNavigation items={menu} />
      </header>
    </Flex>
  );
};

export default Header;

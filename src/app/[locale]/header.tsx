import { Container, Flex } from "@radix-ui/themes";

import { auth } from "@/auth";

// Mobile and desktop navigation
import MobileNavigation from "@/components/mobile-menu/nav";
import DesktopNavigation from "@/components/desktop-menu/nav";

// Navigation menu items
const menu = [
  { name: "items.photo", href: "/product/photo-print" },
  { name: "items.panel", href: "/product/photo-panels" },
  { name: "items.canvas", href: "/product/canvas-print" },
  {
    name: "items.other",
    items: [{ name: "items.magnets", href: "/product/photo-magnets" }],
  },
  { name: "items.about", href: "/about" },
  { name: "items.contact", href: "/contact" },
] as const;

export type MenuItem = (typeof menu)[number];

const Header = async () => {
  const session = await auth();

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
        <Container className="w-full">
          <MobileNavigation items={menu} session={session} />

          <DesktopNavigation items={menu} session={session} />
        </Container>
      </header>
    </Flex>
  );
};

export default Header;

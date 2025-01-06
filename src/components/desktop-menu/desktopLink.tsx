import { forwardRef, ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

import { AppPathnames, Link as RoutingLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const DesktopLink = forwardRef<
  HTMLAnchorElement,
  { href: AppPathnames; className?: string; children: ReactNode }
>(({ href, className, children, ...props }, forwardedRef) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenu.Link asChild active={isActive}>
      <RoutingLink
        // @ts-expect-error Dynamic path - one day...
        href={href}
        className={cn("NavigationMenuLink", className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </RoutingLink>
    </NavigationMenu.Link>
  );
});
DesktopLink.displayName = "DesktopLink";

export default DesktopLink;

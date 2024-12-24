import { Link } from "@/i18n/routing";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Button, Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Header = () => {
  const t = useTranslations("Header");

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
        <Link href="/" aria-label={t("home")}>
          <Image
            src="/brand/icon-light.svg"
            alt=""
            width={32}
            height={40}
            className="block dark:hidden"
          />
          <Image
            src="/brand/icon-dark.svg"
            alt=""
            width={32}
            height={40}
            className="hidden dark:block"
          />
        </Link>

        <Flex gap="3">
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

          <Button
            variant="outline"
            color="gray"
            size="3"
            aria-label={t("menu")}
            className="p-3 text-gray-10"
          >
            <Bars3Icon className="size-6" />
          </Button>
        </Flex>
      </header>
    </Flex>
  );
};

export default Header;

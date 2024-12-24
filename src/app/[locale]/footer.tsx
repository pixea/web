import { Link } from "@/i18n/routing";
import { Flex, Text, Link as RadixLink } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="1"
      mx="2"
      my="8"
      asChild
    >
      <footer>
        <Flex mb="4">
          <Link href="/" aria-label={t("home")}>
            <Image
              src="/brand/logo-light.svg"
              alt=""
              width={80}
              height={30}
              className="block dark:hidden"
            />
            <Image
              src="/brand/logo-dark.svg"
              alt=""
              width={80}
              height={30}
              className="hidden dark:block"
            />
          </Link>
        </Flex>
        <Flex direction="row" align="center" gap="2">
          <RadixLink href="#" color="gray" size="1">
            {t("privacy")}
          </RadixLink>
          <RadixLink href="#" color="gray" size="1">
            {t("conditions")}
          </RadixLink>
        </Flex>
        <Text color="gray" size="1">
          &copy; 2025{" "}
          <RadixLink href="https://dmedia.sk/" target="_blank" color="gray">
            D.MEDIA, s.r.o.
          </RadixLink>{" "}
          {t("rights")}
        </Text>
      </footer>
    </Flex>
  );
};

export default Footer;

import { Link } from "@/i18n/routing";
import { Flex } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Header");

  return (
    <Flex direction="row" justify="center" align="center" gap="3" m="8">
      <Link href="/" aria-label={t("home")}>
        <Image src="/brand/logo.svg" alt="" width={128} height={32} />
      </Link>
    </Flex>
  );
};

export default Footer;

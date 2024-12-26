import { Flex, Heading } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export default function ProductPage() {
  const t = useTranslations("Product");

  return (
    <Flex direction="column" gap="2" mt="4">
      <Heading size="7">{t("title")}</Heading>
    </Flex>
  );
}

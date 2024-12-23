import { Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <Flex direction="column" gap="2" align="center" justify="center" mt="8">
      <Heading>{t("title")}</Heading>
      <Text>{t("text")}</Text>
    </Flex>
  );
}

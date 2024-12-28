import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Text, Container } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OrderPage() {
  const t = useTranslations("Order");

  return (
    <Container size="1" className="w-full" mt="4">
      <Heading size="7">{t("title")}</Heading>

      <Flex direction="column" gap="6" align="center" width="full" mt="6">
        <Flex direction="column" gap="2" align="center">
          <Image
            src="/illustrations/empty-cart.svg"
            alt=""
            width={200}
            height={200}
          />

          <Text color="gray">{t("empty")}</Text>
        </Flex>

        <Button
          variant="solid"
          size="4"
          className="font-semibold w-full"
          asChild
        >
          <Link href="/order/selection">{t("add")}</Link>
        </Button>
      </Flex>
    </Container>
  );
}

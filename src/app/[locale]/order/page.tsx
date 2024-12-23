import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function OrderPage() {
  const t = useTranslations("Order");

  return (
    <Flex direction="column" gap="2" mt="4">
      <Heading>{t("title")}</Heading>

      <Flex direction="column" gap="9" align="center" width="full" mt="8">
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
    </Flex>
  );
}

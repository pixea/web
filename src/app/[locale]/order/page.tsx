import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Text, Container } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import OrderItems from "./items";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function OrderPage() {
  const t = useTranslations("Order");

  return (
    <Container className="w-full" mt="4">
      <Flex
        direction="row"
        justify="between"
        align="center"
        gap="4"
        wrap="wrap"
      >
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="blue" variant="solid" size="3">
          <Link href="/order/selection" className="flex items-center gap-1.5">
            <PlusIcon className="size-4" />
            {t("add")} <Text className="hidden xs:block">{t("item")}</Text>
          </Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="6" align="center" width="full" mt="6">
        <OrderItems />
      </Flex>
    </Container>
  );
}

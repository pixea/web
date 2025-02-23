import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Text, Container } from "@radix-ui/themes";
import OrderItems from "./items";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getTranslations } from "next-intl/server";
import { getCurrentCartContentAction } from "@/hooks/useCart/actions";
import Checkout from "./checkout";

export default async function OrderPage() {
  const t = await getTranslations("Order");
  const cart = await getCurrentCartContentAction();

  return (
    <Container className="w-full" mt="6">
      <Flex
        direction="row"
        justify="between"
        align="center"
        gap="4"
        wrap="wrap"
      >
        <Heading size="8">{t("title")}</Heading>

        <Button asChild color="blue" variant="solid" size="3">
          <Link href="/order/selection" className="flex items-center gap-1.5">
            <PlusIcon className="size-4" />
            {t("add")} <Text className="hidden xs:block">{t("item")}</Text>
          </Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="6" align="center" width="full" mt="6">
        <OrderItems cart={cart.content} />

        <Checkout />
      </Flex>
    </Container>
  );
}

import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Container } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import OrderItems from "./items";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function OrderPage() {
  const t = useTranslations("Order");

  return (
    <Container className="w-full" mt="4">
      <Flex direction="row" justify="between" align="center" gap="4">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="blue" variant="solid" size="3">
          <Link href="/order/selection" className="flex items-center">
            <PlusCircleIcon className="size-4" />
            {t("add")}
          </Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="6" align="center" width="full" mt="6">
        <OrderItems />
      </Flex>
    </Container>
  );
}

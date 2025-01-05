import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Heading, Container } from "@radix-ui/themes";

import { Link } from "@/i18n/routing";

import { getTranslations } from "next-intl/server";
import Form from "./form";
import { auth } from "@/auth";
import { getCurrentCartContentAction } from "@/hooks/useCart/actions";

const OrderItemPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const t = await getTranslations("OrderItem");
  const session = await auth();
  const cart = await getCurrentCartContentAction();

  return (
    <Container className="w-full gap-4" mt="4">
      <Flex direction="row" justify="between" align="center">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Form session={session} initialCart={cart.content} itemId={id} />
    </Container>
  );
};

export default OrderItemPage;

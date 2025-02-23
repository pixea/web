import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Heading, Container } from "@radix-ui/themes";

import { Link } from "@/i18n/routing";

import { getTranslations } from "next-intl/server";
import Form from "./form";
import { auth } from "@/auth";
import { getCurrentCartContentAction } from "@/hooks/useCart/actions";
import db from "@/db";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema";

const OrderItemPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ productId?: string }>;
}) => {
  const { id } = await params;
  const { productId: queryProductId } = await searchParams;

  const t = await getTranslations("OrderItem");
  const session = await auth();
  const cart = await getCurrentCartContentAction();

  const item = cart.content?.items?.find((item) => item.id === id);
  const productId = item?.productId || queryProductId;
  if (!productId) {
    throw new Error("Product ID is required to add an item");
  }
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product) {
    throw new Error("Product was not found");
  }

  return (
    <Container className="w-full gap-4" mt="6">
      <Flex direction="row" justify="between" align="center">
        <Heading size="8">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Form
        session={session}
        initialCart={cart.content}
        itemId={id}
        product={product}
      />
    </Container>
  );
};

export default OrderItemPage;

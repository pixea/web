import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Grid, Container } from "@radix-ui/themes";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import ProductPreview from "./product";
import { getTranslations } from "next-intl/server";
import { desc, eq } from "drizzle-orm";
import { products as productsSchema } from "@/db/schema";
import db from "@/db";

const OrderItemSelectionPage = async () => {
  const t = await getTranslations("OrderItemSelection");

  const products = await db
    .select()
    .from(productsSchema)
    .where(eq(productsSchema.status, "active"))
    .orderBy(desc(productsSchema.created));

  return (
    <Container className="w-full" mt="4">
      <Flex direction="row" justify="between" align="center" gap="4">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Grid
        columns={{
          initial: "1",
          xs: "2",
          sm: "3",
          md: "4",
        }}
        gap="4"
        width="full"
        mt="4"
      >
        {products.map((product) => (
          <ProductPreview key={product.id} product={product} />
        ))}
      </Grid>
    </Container>
  );
};

export default OrderItemSelectionPage;

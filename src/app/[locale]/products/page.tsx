import { Link } from "@/i18n/routing";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import ProductsTable from "./table";
import db from "@/db";
import { products as productsSchema } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";

const ProductsPage = async () => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const t = await getTranslations("Products");

  const products = await db
    .select()
    .from(productsSchema)
    .orderBy(desc(productsSchema.created));

  return (
    <Container className="w-full" mt="4">
      <Flex direction="column" gap="4" mt="4">
        <Flex
          direction="row"
          justify="between"
          align="center"
          gap="4"
          wrap="wrap"
        >
          <Heading size="7">{t("title")}</Heading>

          <Button asChild color="blue" variant="solid" size="2">
            {/* @ts-expect-error Dynamic path */}
            <Link href="/products/new" className="flex items-center gap-1.5">
              <PlusIcon className="size-4" />
              {t("add")}
            </Link>
          </Button>
        </Flex>

        <ProductsTable products={products} />
      </Flex>
    </Container>
  );
};

export default ProductsPage;

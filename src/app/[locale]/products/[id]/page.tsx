import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { zodToJsonSchema } from "zod-to-json-schema";

import { auth } from "@/auth";
import { Link } from "@/i18n/routing";
import db from "@/db";
import { products } from "@/db/schema";
import { productSchema } from "@/db/validation";
import ProductForm from "./form";

const ProductEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const t = await getTranslations("Products");

  const { id } = await params;
  const product =
    id === "new"
      ? null
      : await db.query.products.findFirst({ where: eq(products.id, id) });

  const value = JSON.stringify(
    product
      ? {
          ...product,
          id: undefined,
          created: undefined,
          updated: undefined,
        }
      : {},
    null,
    2
  );

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

          <Button asChild color="gray" variant="ghost" size="2">
            <Link href="/products" className="flex items-center gap-1.5">
              <ArrowUturnLeftIcon className="size-4" />
              {t("back")}
            </Link>
          </Button>
        </Flex>

        <ProductForm
          id={id}
          value={value}
          schema={zodToJsonSchema(productSchema)}
        />
      </Flex>
    </Container>
  );
};

export default ProductEditPage;

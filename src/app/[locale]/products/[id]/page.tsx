import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading, TextField } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";
import { zodToJsonSchema } from "zod-to-json-schema";

import { Link } from "@/i18n/routing";

import { saveProductAction } from "../actions";
import MonacoInput from "./monaco";
import BottomBar from "@/components/bottomBar";
import db from "@/db";
import { productSchema } from "@/db/validation";
import { eq } from "drizzle-orm";
import { products } from "@/db/schema";
import { auth } from "@/auth";

const ProductEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const t = await getTranslations("ProductEdit");

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

        <form action={saveProductAction}>
          <TextField.Root
            type="hidden"
            name="id"
            className="hidden"
            value={id === "new" ? "" : id}
          />

          <MonacoInput
            name="values"
            defaultValue={value}
            schema={zodToJsonSchema(productSchema)}
          />

          <BottomBar justify="end">
            <Button
              type="submit"
              variant="solid"
              size="3"
              className="font-semibold"
            >
              {t("save")}
            </Button>
          </BottomBar>
        </form>
      </Flex>
    </Container>
  );
};

export default ProductEditPage;

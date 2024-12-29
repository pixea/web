import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading, TextField } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";
import { zodToJsonSchema } from "zod-to-json-schema";

import { Link } from "@/i18n/routing";

import { productSchema } from "./schema";
import { save } from "./actions";
import MonacoInput from "./monaco";

const ProductEditPage = async () => {
  const t = await getTranslations("ProductEdit");

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

        <form action={save}>
          <TextField.Root type="hidden" name="id" className="hidden" />

          <MonacoInput
            name="values"
            defaultValue="{}"
            schema={zodToJsonSchema(productSchema)}
          />
        </form>
      </Flex>
    </Container>
  );
};

export default ProductEditPage;

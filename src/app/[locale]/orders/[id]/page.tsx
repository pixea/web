import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { zodToJsonSchema } from "zod-to-json-schema";

import { auth } from "@/auth";
import { Link } from "@/i18n/routing";
import db from "@/db";
import { orders } from "@/db/schema";
import { orderSchema } from "@/db/validation";
import OrderForm from "./form";

const OrderEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const t = await getTranslations("Orders");

  const { id } = await params;
  const order =
    id === "new"
      ? null
      : await db.query.orders.findFirst({ where: eq(orders.id, id) });

  const value = JSON.stringify(
    order
      ? {
          ...order,
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
            <Link href="/orders" className="flex items-center gap-1.5">
              <ArrowUturnLeftIcon className="size-4" />
              {t("back")}
            </Link>
          </Button>
        </Flex>

        <OrderForm
          id={id}
          value={value}
          schema={zodToJsonSchema(orderSchema)}
        />
      </Flex>
    </Container>
  );
};

export default OrderEditPage;

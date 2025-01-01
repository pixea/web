import { Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import OrdersTable from "./table";
import db from "@/db";
import { orders as ordersSchema } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";

const OrdersPage = async () => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const t = await getTranslations("Orders");

  const orders = await db
    .select()
    .from(ordersSchema)
    .orderBy(desc(ordersSchema.created));

  return (
    <Container className="w-full" mt="4">
      <Flex direction="column" gap="4" mt="4">
        <Heading size="7">{t("title")}</Heading>

        <OrdersTable orders={orders} />
      </Flex>
    </Container>
  );
};

export default OrdersPage;

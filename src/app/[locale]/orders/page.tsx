import { Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import OrdersTable from "./table";
import db from "@/db";
import { orders as ordersSchema } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

const OrdersPage = async () => {
  const locale = await getLocale();
  const session = await auth();

  const t = await getTranslations("Orders");

  if (session?.user.role === "admin") {
    const [orders, settings] = await Promise.all([
      db.select().from(ordersSchema).orderBy(desc(ordersSchema.created)),
      db.query.orderSettings.findFirst(),
    ]);

    return (
      <Container className="w-full" mt="5">
        <Flex direction="column" gap="4" mt="4">
          <Heading size="7">{t("title")}</Heading>

          <OrdersTable
            orders={orders}
            mode="admin"
            adminNotificationEmails={settings?.adminNotificationEmails || []}
            notificationEmailCount={settings?.adminNotificationEmails?.length || 0}
          />
        </Flex>
      </Container>
    );
  }

  if (!session?.user?.id) {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const customerOrders = await db
    .select()
    .from(ordersSchema)
    .where(eq(ordersSchema.userId, session.user.id))
    .orderBy(desc(ordersSchema.created));

  return (
    <Container className="w-full" mt="5">
      <Flex direction="column" gap="4" mt="4">
        <Heading size="7">{t("myOrdersTitle")}</Heading>

        <OrdersTable orders={customerOrders} mode="customer" />
      </Flex>
    </Container>
  );
};

export default OrdersPage;

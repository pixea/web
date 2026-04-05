import { render } from "@react-email/render";
import { createTranslator } from "next-intl";

import messages from "../../messages";
import OrderNewAdminEmail from "../../emails/order-new-admin";
import OrderStatusCustomerEmail from "../../emails/order-status-customer";
import { Locales } from "@/i18n/locales";
import { Order, OrderSettings } from "@/db/schema";
import { OrderStatusValue } from "@/lib/order-status";

import { emailFrom, emailReplyTo, resend } from ".";

const normalizeRecipients = (emails: string[]) =>
  Array.from(
    new Set(
      emails
        .map((email) => email.trim().toLowerCase())
        .filter((email) => email.length > 3),
    ),
  );

const toOrderSummaryText = (order: Order) => {
  const subtotal = order.sum?.cost ?? 0;
  const delivery = order.sum?.delivery ?? 0;
  const vat = order.sum?.vat ?? 0;
  const total = subtotal + delivery + vat;

  return [
    `Order #${order.id}`,
    `Status: ${order.status}`,
    `Items: ${order.items?.length ?? 0}`,
    `Subtotal: ${subtotal.toFixed(2)} EUR`,
    `Delivery: ${delivery.toFixed(2)} EUR`,
    `VAT: ${vat.toFixed(2)} EUR`,
    `Total: ${total.toFixed(2)} EUR`,
  ].join("\n");
};

export const sendAdminNewOrderNotification = async ({
  locale,
  order,
  settings,
}: {
  locale: Locales;
  order: Order;
  settings?: OrderSettings | null;
}) => {
  const recipients = normalizeRecipients(settings?.adminNotificationEmails || []);
  if (!recipients.length) {
    return;
  }

  const intl = createTranslator({
    locale,
    messages: messages[locale].OrderNotification,
  });

  const subject = intl("adminNewOrder.subject", {
    orderId: order.id.slice(0, 8).toUpperCase(),
  });
  const preview = intl("adminNewOrder.preview", {
    orderId: order.id.slice(0, 8).toUpperCase(),
    total: (order.sum.cost + order.sum.delivery + order.sum.vat).toFixed(2),
  });
  const orderUrl = `https://pixea.sk/${locale}/orders/${order.id}`;

  const emailJSX = OrderNewAdminEmail({
    locale,
    orderId: order.id,
    customerEmail: order.email,
    itemCount: order.items.length,
    subtotal: order.sum.cost,
    delivery: order.sum.delivery,
    vat: order.sum.vat,
    total: order.sum.cost + order.sum.delivery + order.sum.vat,
    preview,
    orderUrl,
  });

  const result = await resend.emails.send({
    from: emailFrom,
    to: recipients,
    replyTo: emailReplyTo,
    subject,
    html: await render(emailJSX, { pretty: true }),
    text: toOrderSummaryText(order),
  });

  if (result.error) {
    throw new Error("Resend error: " + JSON.stringify(result.error));
  }
};

export const sendCustomerStatusNotification = async ({
  locale,
  order,
  status,
}: {
  locale: Locales;
  order: Order;
  status: OrderStatusValue;
}) => {
  if (!order.email) return;

  const intl = createTranslator({
    locale,
    messages: messages[locale].OrderNotification,
  });

  const subject = intl("customerStatus.subject", {
    orderId: order.id.slice(0, 8).toUpperCase(),
  });
  const orderUrl = `https://pixea.sk/${locale}/orders`;

  const emailJSX = OrderStatusCustomerEmail({
    locale,
    orderId: order.id,
    statusLabel: intl(`statuses.${status}`),
    orderUrl,
  });

  const result = await resend.emails.send({
    from: emailFrom,
    to: order.email,
    replyTo: emailReplyTo,
    subject,
    html: await render(emailJSX, { pretty: true }),
    text: [
      `Order #${order.id}`,
      `Status changed to: ${status}`,
      "",
      toOrderSummaryText(order),
    ].join("\n"),
  });

  if (result.error) {
    throw new Error("Resend error: " + JSON.stringify(result.error));
  }
};

export const notifyNewOrderToAdmins = async ({
  orderId,
  locale,
}: {
  orderId: string;
  locale: Locales;
}) => {
  try {
    const { default: db } = await import("@/db");
    const { orders } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const [order, settings] = await Promise.all([
      db.query.orders.findFirst({ where: eq(orders.id, orderId) }),
      db.query.orderSettings.findFirst(),
    ]);
    if (!order) return;

    await sendAdminNewOrderNotification({ locale, order, settings });
  } catch (e) {
    console.error("Failed to send admin new-order notification:", e);
  }
};

export const notifyOrderStatusChanged = async ({
  orderId,
  locale,
  nextStatus,
}: {
  orderId: string;
  locale: Locales;
  nextStatus: OrderStatusValue;
}) => {
  try {
    const { default: db } = await import("@/db");
    const { orders } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    if (!order) return;

    await sendCustomerStatusNotification({
      locale,
      order,
      status: nextStatus,
    });
  } catch (e) {
    console.error("Failed to send customer status notification:", e);
  }
};

"use server";

import { auth } from "@/auth";
import db from "@/db";
import { orderSettings, orders } from "@/db/schema";
import { OrderStatusValue, orderStatusValues } from "@/lib/order-status";
import { error, noChanges, success } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyOrderStatusChanged } from "@/emails/orders";
import { ZodError, z } from "zod";
import { Locales } from "@/i18n/locales";

const statusValueSet = new Set(orderStatusValues);
const parseAdminEmails = (value: string) =>
  value
    .split(/[\n,;]+/g)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
const emailSchema = z.string().email();

export const saveOrderAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  const locale = await getLocale();

  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !status) {
    return noChanges();
  }

  if (!statusValueSet.has(status as OrderStatusValue)) {
    return error("error", new Error("Invalid status value"));
  }
  const nextStatus = status as OrderStatusValue;

  try {
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, id),
    });
    if (!existingOrder) {
      return error("error", new Error("Order not found"));
    }

    if (existingOrder.status === nextStatus) {
      return noChanges();
    }

    await db.update(orders).set({ status: nextStatus }).where(eq(orders.id, id));

    await notifyOrderStatusChanged({
      orderId: existingOrder.id,
      locale: locale as Locales,
      nextStatus,
    });
  } catch (e) {
    return error("error", e);
  }

  revalidatePath(`/${locale}/orders`);
  revalidatePath(`/${locale}/orders/${id}`);
  revalidatePath(`/${locale}/auth`);

  return success();
};

export const saveOrderSettingsAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const emails = parseAdminEmails((formData.get("adminNotificationEmails") as string) || "");

  try {
    emails.forEach((email) => {
      emailSchema.parse(email);
    });
  } catch (e) {
    return error("error", e instanceof ZodError ? e.issues : e);
  }

  try {
    const [current] = await db.select().from(orderSettings).limit(1);

    if (!current) {
      await db.insert(orderSettings).values({
        adminNotificationEmails: emails,
      });
    } else {
      await db
        .update(orderSettings)
        .set({ adminNotificationEmails: emails })
        .where(eq(orderSettings.id, current.id));
    }
  } catch (e) {
    return error("error", e);
  }

  revalidatePath(`/${locale}/orders`);

  return success();
};

export const deleteOrderAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/orders`)}`);
  }

  const id = formData.get("id") as string;

  try {
    await db.delete(orders).where(eq(orders.id, id));
  } catch (e) {
    return error("error", e);
  }

  revalidatePath(`/${locale}/orders/${id}`);
  revalidatePath(`/${locale}/orders`);
  revalidatePath(`/${locale}/order`);
  revalidatePath(`/${locale}/auth`);

  return success();
};

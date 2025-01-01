"use server";

import { auth } from "@/auth";
import db from "@/db";
import { orders } from "@/db/schema";
import { OrderPayload } from "@/db/validation";
import { error, noChanges, success } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

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
  const valuesString = formData.get("values") as string;

  if (!valuesString) {
    return noChanges();
  }

  const values = {
    ...(JSON.parse(valuesString) as OrderPayload),
    // Would wreak havoc
    emailVerified: undefined,
  };

  try {
    if (id) {
      await db.update(orders).set(values).where(eq(orders.id, id));
    } else {
      const order = await db
        .insert(orders)
        .values(values)
        .returning({ id: orders.id });

      redirect(`/${locale}/orders/${order[0].id}`);
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return error("error", e);
  }

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

  return success();
};

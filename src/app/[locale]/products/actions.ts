"use server";

import { auth } from "@/auth";
import db from "@/db";
import { products } from "@/db/schema";
import { ProductPayload } from "@/db/validation";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const saveProductAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  const locale = await getLocale();

  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  const values = JSON.parse(valuesString) as ProductPayload;

  try {
    if (id) {
      await db.update(products).set(values).where(eq(products.id, id));
    } else {
      const product = await db
        .insert(products)
        .values(values)
        .returning({ id: products.id });

      redirect(`/${locale}/products/${product[0].id}`);
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { message: "error", details: e };
  }

  return { message: "done" };
};

export const deleteProductAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const id = formData.get("id") as string;

  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (e) {
    return { message: "error", details: e };
  }

  revalidatePath(`/${locale}/products/${id}`);

  return { message: "done" };
};

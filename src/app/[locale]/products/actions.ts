"use server";

import { auth } from "@/auth";
import db from "@/db";
import { products } from "@/db/schema";
import { ProductPayload } from "@/db/validation";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const saveProductAction = async (formData: FormData) => {
  const session = await auth();
  const locale = await getLocale();

  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  const values = JSON.parse(valuesString) as ProductPayload;

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    const product = await db
      .insert(products)
      .values(values)
      .returning({ id: products.id });

    redirect(`/${locale}/products/${product[0].id}`);
  }
};

export const deleteProductAction = async (id: string) => {
  const session = await auth();
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const locale = await getLocale();

  await db.delete(products).where(eq(products.id, id));

  revalidatePath(`/${locale}/products/${id}`);
};

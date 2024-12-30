"use server";

import { auth } from "@/auth";
import db from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const saveAction = async (formData: FormData) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  const values = JSON.parse(valuesString);

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    const product = await db
      .insert(products)
      .values(values)
      .returning({ insertedId: products.id });

    redirect(`/products/${product[0].insertedId}`);
  }
};

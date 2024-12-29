"use server";

import { auth } from "@/auth";
import db from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const save = async (formData: FormData) => {
  const session = await auth();

  if (session?.user.role !== "admin") {
    throw new Error("Not authorized");
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  const values = JSON.parse(valuesString);

  if (id) {
    await db.update(products).set(values).where(eq(products.id, id));
  } else {
    await db.insert(products).values(values);
  }
};

"use server";

import { auth, signIn, signOut, unstable_update } from "@/auth";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const sendCodeAction = async (formData: FormData) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "email",
    value: formData.get("email") as string,
    maxAge: 60 * 60 * 24 * 31,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  await signIn("resend", formData);
};

export const saveAccountAction = async (formData: FormData) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const country = formData.get("country");

  await db
    .update(users)
    .set({
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      companyId: formData.get("companyId") as string,
      taxId: formData.get("taxId") as string,
      vatId: formData.get("vatId") as string,
      phone: formData.get("phone") as string,
      address: {
        street: (formData.get("street") as string) || undefined,
        additional: (formData.get("additional") as string) || undefined,
        zip: (formData.get("zip") as string) || undefined,
        city: (formData.get("city") as string) || undefined,
        country:
          !country || country === "none" ? undefined : (country as string),
      },
    })
    .where(eq(users.id, session.user?.id));

  await unstable_update({});
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("email");

  await signOut();
};

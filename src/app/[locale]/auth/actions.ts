"use server";

import { auth, signIn, signOut, unstable_update } from "@/auth";
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const sendCode = async (formData: FormData) => {
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

export const saveAccount = async (formData: FormData) => {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  await db
    .update(users)
    .set({
      name: formData.get("name") as string,
    })
    .where(eq(users.id, session.user?.id));

  await unstable_update({});
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("email");

  await signOut();
};

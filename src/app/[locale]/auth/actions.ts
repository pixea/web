"use server";

import { auth, signIn, signOut, unstable_update } from "@/auth";
import db from "@/db";
import { users } from "@/db/schema";
import { error, success } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const sendCodeAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "email",
    value: formData.get("email") as string,
    maxAge: 60 * 60 * 24 * 31,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  cookieStore.set({
    name: "lastPath",
    value: formData.get("lastPath") as string,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  try {
    await signIn("resend", formData);
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return error("error", e);
  }

  return success();
};

export const saveAccountAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/auth`);
  }

  const country = formData.get("country");

  try {
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
  } catch (e) {
    return error("error", e);
  }

  await unstable_update({});

  return success();
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("email");

  await signOut();
};

"use server";

import { auth } from "@/auth";
import db from "@/db";
import { users } from "@/db/schema";
import { UserPayload } from "@/db/validation";
import { error, noChanges, success } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const saveUserAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  const locale = await getLocale();

  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/users`)}`);
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  if (!valuesString) {
    return noChanges();
  }

  if (!id || id === "new") {
    redirect("/users");
  }

  const values = {
    ...(JSON.parse(valuesString) as UserPayload),
    // Would wreak havoc
    emailVerified: undefined,
  };

  try {
    await db.update(users).set(values).where(eq(users.id, id));
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return error("error", e);
  }

  return success();
};

export const deleteUserAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/users`)}`);
  }

  const id = formData.get("id") as string;

  try {
    await db.delete(users).where(eq(users.id, id));
  } catch (e) {
    return error("error", e);
  }

  revalidatePath(`/${locale}/users/${id}`);

  return success();
};

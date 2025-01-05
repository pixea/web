"use server";

import { auth } from "@/auth";
import db from "@/db";
import { guestCarts, users } from "@/db/schema";
import {
  OrderItemFilePayload,
  OrderItemPayload,
  ShoppingCart,
} from "@/db/validation";
import { createThumbnail } from "@/utils/thumbnail";
import { eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";

export const getCurrentCartItemCountAction = async () => {
  try {
    const newestCart = await getNewestCartAction();

    return newestCart?.content?.items?.length || 0;
  } catch (e) {
    console.error(e);

    throw Response.json(
      { error: "Unknown error occurred when retrieving cart item count" },
      { status: 500 }
    );
  }
};

export const getCurrentCartContentAction = async () => {
  try {
    const newestCart = await getNewestCartAction();

    if (newestCart) {
      return newestCart;
    }

    return startNewCartAction();
  } catch (e) {
    console.error(e);

    throw Response.json(
      { error: "Unknown error occurred when retrieving cart content" },
      { status: 500 }
    );
  }
};

export const addFileToCartItemAction = async (
  cartItemId: string,
  file: OrderItemFilePayload
) => {
  const session = await auth();

  let metadata: Record<string, unknown>;
  try {
    metadata = await createThumbnail(file, !!session?.user?.id);
  } catch (e) {
    console.warn(`Could not generate thumbnail for /original/${file.s3Key}`, e);
  }

  try {
    const newestCart = await getNewestCartAction();

    if (!newestCart?.content) {
      return Response.json({ error: "No cart found" }, { status: 404 });
    }

    const cart = await db.transaction(async (tx) => {
      const cart =
        newestCart.source === "user"
          ? (
              await tx
                .select({ cart: users.cart })
                .from(users)
                .for("update")
                .where(eq(users.id, session?.user.id as string))
            )[0].cart
          : (
              await tx
                .select({ cart: guestCarts.content })
                .from(guestCarts)
                .for("update")
                .where(eq(guestCarts.id, newestCart?.content?.id as string))
            )[0].cart;

      if (!cart) {
        throw Response.json({ error: "No cart found" }, { status: 404 });
      }

      const existingItem = cart.items?.find((item) => item.id === cartItemId);

      const item: Partial<OrderItemPayload> = existingItem || {
        id: cartItemId,
        files: { pieces: 1, items: [] },
      };

      if (!item.files) {
        item.files = { pieces: 1, items: [] };
      }

      item.files.items.push({ ...file, metadata, hasThumbnail: !!metadata });

      if (existingItem) {
        cart.items = cart.items!.map((i) => (i.id === cartItemId ? item : i));
      } else {
        if (!cart.items) {
          cart.items = [];
        }
        cart.items.push(item);
      }

      cart.saved = DateTime.utc().toISO();

      if (newestCart.source === "user") {
        await tx
          .update(users)
          .set({ cart })
          .where(eq(users.id, session?.user.id as string));
      } else {
        await tx.update(guestCarts).set({ content: cart });
      }

      return cart;
    });

    return cart;
  } catch (e) {
    console.error(e);

    throw Response.json(
      { error: "Unknown error occurred when adding file to cart item" },
      { status: 500 }
    );
  }
};

const getNewestCartAction = async () => {
  const session = await auth();

  const userCart = session?.user?.cart;

  const cookieStore = await cookies();
  const guestCartId = cookieStore.get("cartId")?.value;

  const guestCart = guestCartId
    ? (
        await db.query.guestCarts.findFirst({
          where: eq(guestCarts.id, guestCartId),
        })
      )?.content
    : undefined;

  const userCartTime = userCart?.saved ? DateTime.fromISO(userCart.saved) : 0;
  const guestCartTime = guestCart?.saved
    ? DateTime.fromISO(guestCart.saved)
    : 0;

  if (userCartTime && userCartTime > guestCartTime) {
    return { content: userCart!, source: "user" as const };
  }

  if (guestCartTime) {
    return { content: guestCart!, source: "guest" as const };
  }
};

const startNewCartAction = async () => {
  const session = await auth();
  const cookieStore = await cookies();

  const cart = {
    id: randomUUID(),
    saved: DateTime.utc().toISO(),
  } as ShoppingCart;

  if (session?.user?.id) {
    await db.update(users).set({ cart }).where(eq(users.id, session.user.id));

    cookieStore.delete("cartId");

    return { content: cart, source: "user" as const };
  } else {
    await db.insert(guestCarts).values({ id: cart.id, content: cart });

    cookieStore.set({
      name: "cartId",
      value: cart.id,
      maxAge: 60 * 60 * 24 * 31,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return { content: cart, source: "guest" as const };
  }
};

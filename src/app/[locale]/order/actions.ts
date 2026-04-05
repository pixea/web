"use server";

import { auth } from "@/auth";
import db from "@/db";
import { orders, products, users } from "@/db/schema";
import { OrderItemPayload } from "@/db/validation";
import { calculateItemPrice } from "@/utils/pricing";
import { eq, inArray } from "drizzle-orm";
import { DateTime } from "luxon";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";

import { error, noChanges, success } from "@/lib/utils";

const toOptionalString = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const toRequiredString = (
  value: FormDataEntryValue | null,
  fieldName: string,
) => {
  const normalized = toOptionalString(value);
  if (!normalized) {
    throw new Error(`Missing required field: ${fieldName}`);
  }
  return normalized;
};

const toCountryCode = (value: FormDataEntryValue | null) => {
  const normalized = toOptionalString(value);
  if (!normalized || normalized === "none") {
    return undefined;
  }
  return normalized;
};

const roundMoney = (value: number) =>
  Number((Number.isFinite(value) ? value : 0).toFixed(2));

const COUNTRY_CODES = new Set([
  "at",
  "be",
  "bg",
  "cy",
  "cz",
  "de",
  "dk",
  "ee",
  "es",
  "fi",
  "fr",
  "gr",
  "hr",
  "hu",
  "ie",
  "im",
  "it",
  "lt",
  "lu",
  "lv",
  "mc",
  "mt",
  "nl",
  "pl",
  "pt",
  "ro",
  "se",
  "si",
  "sk",
]);

export const submitOrderAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/order`)}`);
  }

  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        phone: users.phone,
        cart: users.cart,
        company: users.company,
        companyId: users.companyId,
        taxId: users.taxId,
        vatId: users.vatId,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || !user.cart) {
      return noChanges();
    }

    const cartItems = (user.cart.items || []).filter(
      (item): item is OrderItemPayload =>
        !!item?.id &&
        !!item.productId &&
        Array.isArray(item.files?.items) &&
        item.files.items.length > 0 &&
        !!item.size?.dimensions?.length,
    );
    if (!cartItems.length) {
      return noChanges();
    }

    const uniqueProductIds = Array.from(
      new Set(cartItems.map((item) => item.productId)),
    );
    const cartProducts =
      uniqueProductIds.length > 0
        ? await db.query.products.findMany({
            where: inArray(products.id, uniqueProductIds),
          })
        : [];

    const productById = new Map(
      cartProducts.map((product) => [product.id, product]),
    );
    const pricedItems = cartItems.map((item) => {
      const product = productById.get(item.productId);
      const computedPrice = product ? calculateItemPrice(product, item) : 0;
      return {
        ...item,
        price: roundMoney(item.price ?? computedPrice),
      };
    });

    const subtotal = roundMoney(
      pricedItems.reduce((sum, item) => sum + (item.price || 0), 0),
    );

    const deliveryTypeRaw = toRequiredString(
      formData.get("deliveryType"),
      "deliveryType",
    );
    const deliveryType: "courier" | "pickup" =
      deliveryTypeRaw === "pickup" ? "pickup" : "courier";
    const deliveryCost = deliveryType === "pickup" ? 0 : 3.9;
    const vat = roundMoney((subtotal + deliveryCost) * 0.2);

    const deliveryCountry = toCountryCode(formData.get("country"));
    if (!deliveryCountry || !COUNTRY_CODES.has(deliveryCountry)) {
      throw new Error("Missing required field: country");
    }

    const deliveryAddress = {
      street: toRequiredString(formData.get("street"), "street"),
      additional: toOptionalString(formData.get("additional")),
      zip: toRequiredString(formData.get("zip"), "zip"),
      city: toRequiredString(formData.get("city"), "city"),
      country: deliveryCountry,
    };

    const invoiceSameAsDelivery = formData.get("invoiceSameAsDelivery") === "on";

    const invoiceAddress = invoiceSameAsDelivery
      ? {
          company: toOptionalString(formData.get("company")) || user.company || undefined,
          companyId:
            toOptionalString(formData.get("companyId")) || user.companyId || undefined,
          taxId: toOptionalString(formData.get("taxId")) || user.taxId || undefined,
          vatId: toOptionalString(formData.get("vatId")) || user.vatId || undefined,
          ...deliveryAddress,
        }
      : {
          company:
            toOptionalString(formData.get("invoiceCompany")) || user.company || undefined,
          companyId:
            toOptionalString(formData.get("invoiceCompanyId")) ||
            user.companyId ||
            undefined,
          taxId: toOptionalString(formData.get("invoiceTaxId")) || user.taxId || undefined,
          vatId: toOptionalString(formData.get("invoiceVatId")) || user.vatId || undefined,
          street: toRequiredString(formData.get("invoiceStreet"), "invoiceStreet"),
          additional: toOptionalString(formData.get("invoiceAdditional")),
          zip: toRequiredString(formData.get("invoiceZip"), "invoiceZip"),
          city: toRequiredString(formData.get("invoiceCity"), "invoiceCity"),
          country: (() => {
            const country = toCountryCode(formData.get("invoiceCountry"));
            if (!country || !COUNTRY_CODES.has(country)) {
              throw new Error("Missing required field: invoiceCountry");
            }
            return country;
          })(),
        };

    const order: typeof orders.$inferInsert = {
      status: "new" as const,
      paid: false,
      items: pricedItems,
      itemsSummary: `${pricedItems.length} item(s)`,
      userId: user.id,
      email: user.email || session.user.email,
      phone: toOptionalString(formData.get("phone")) || user.phone,
      deliveryAddress,
      invoiceAddress,
      delivery: {
        type: deliveryType,
        tracking: null,
      },
      sum: {
        cost: subtotal,
        originalMargin: undefined,
        margin: subtotal,
        delivery: roundMoney(deliveryCost),
        vat,
      },
    };

    const nextCart = await db.transaction(async (tx) => {
      await tx.insert(orders).values(order);

      const nextCart = {
        id: randomUUID(),
        saved: DateTime.utc().toISO(),
      };

      await tx
        .update(users)
        .set({ cart: nextCart })
        .where(eq(users.id, user.id));
      return nextCart;
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "cartId",
      value: nextCart.id,
      maxAge: 60 * 60 * 24 * 31,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
    revalidatePath(`/${locale}/order`);
    revalidatePath(`/${locale}/orders`);
  } catch (e) {
    return error("error", e);
  }

  return success();
};

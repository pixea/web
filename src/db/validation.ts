import z from "zod";

export const translatedPropertySchema = z.object({
  sk: z.string(),
  en: z.string(),
});

export const pricePropertySchema = z.object({
  type: z.enum(["fixed", "per-meter-squared", "per-item"]),
  cost: z.number().optional(),
  margin: z.number().optional(),
});

export const baseConfigurationSchema = z.object({
  id: z.string(),
  name: translatedPropertySchema.required(),
  default: z.string().optional(),
  required: z.boolean().optional(),
});

export const radioCardConfigurationSchema = baseConfigurationSchema.merge(
  z.object({
    type: z.literal("radio-card"),
    options: z
      .array(
        z.object({
          id: z.string(),
          name: translatedPropertySchema.required(),
          description: translatedPropertySchema.required(),
          price: pricePropertySchema,
        })
      )
      .min(1),
  })
);

export const productSchema = z.object({
  slug: translatedPropertySchema
    .required()
    .describe(
      "Unique URL identifier. Please do NOT change this after the product is published. Do NOT use spaces and diacritics."
    ),
  name: translatedPropertySchema.required(),
  description: translatedPropertySchema.required(),

  status: z.enum(["active", "draft"]).default("draft"),

  image: z.string().optional(),

  files: z.object({
    piecePerFile: z
      .boolean()
      .default(true)
      .describe(
        "Whether each file represents a single print (like in photos) or they all represent a single print (like in calendars)."
      ),
    min: z.number().min(1).optional(),
    max: z.number().optional(),
  }),

  size: z.object({
    options: z
      .array(
        z.object({
          dimensions: z.tuple([z.number(), z.number()]),
          common: z.boolean().optional(),
        })
      )
      .min(1),
  }),

  configuration: z.array(
    baseConfigurationSchema.and(radioCardConfigurationSchema)
  ),
});

export const userSchema = z.object({
  name: z.string().optional().nullable(),
  role: z.enum(["customer", "admin"]).default("customer"),
  company: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  vatId: z.string().optional().nullable(),
  email: z.string().email(),
  emailVerified: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z
    .object({
      street: z.string().optional(),
      additional: z.string().optional(),
      zip: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  image: z.string().optional().nullable(),
});

export const orderItemFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  s3Key: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  hasThumbnail: z.boolean(),
  pieces: z.number().optional(),
});

export const orderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  files: z.object({
    pieces: z.number().optional(),
    items: z.array(orderItemFileSchema),
  }),
  size: z.object({
    dimensions: z.tuple([z.number(), z.number()]),
  }),
  configuration: z.array(
    z.object({
      id: z.string(),
      option: z.string(),
    })
  ),
});

export const orderSchema = z.object({
  status: z
    .enum(["new", "processed", "prepared", "delivery", "delivered"])
    .default("new"),
  paid: z.boolean().default(false),

  items: z.array(orderItemSchema),
  itemsSummary: z.string().optional().nullable(),

  userId: z.string().uuid().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),

  deliveryAddress: z.object({
    street: z.string(),
    additional: z.string().optional(),
    zip: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  invoiceAddress: z.object({
    company: z.string().optional(),
    companyId: z.string().optional(),
    taxId: z.string().optional(),
    vatId: z.string().optional(),
    street: z.string(),
    additional: z.string().optional(),
    zip: z.string(),
    city: z.string(),
    country: z.string(),
  }),

  delivery: z.object({
    type: z.enum(["courier", "pickup"]),
    tracking: z.string().optional().nullable(),
  }),

  sum: z.object({
    cost: z.number(),
    originalMargin: z.number().optional(),
    margin: z.number(),
    delivery: z.number(),
    vat: z.number(),
  }),
});

export type UserPayload = z.infer<typeof userSchema>;
export type ProductPayload = z.infer<typeof productSchema>;
export type OrderItemFilePayload = z.infer<typeof orderItemFileSchema>;
export type OrderItemPayload = z.infer<typeof orderItemSchema>;
export type OrderPayload = z.infer<typeof orderSchema>;

export type ShoppingCartItem = Partial<OrderItemPayload>;
export type ShoppingCart = Partial<Omit<OrderPayload, "items">> & {
  id: string;
  /**
   * ISO 8601 date time string
   */
  saved: string;
  items?: ShoppingCartItem[];
};

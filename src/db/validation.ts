import z from "zod";

export const translatedPropertySchema = z.object({
  sk: z.string().describe("Localized value in Slovak."),
  en: z.string().describe("Localized value in English."),
});

export const pricePropertySchema = z.object({
  type: z
    .enum(["fixed", "per-meter-squared", "per-file", "per-piece"])
    .describe("How this price is applied."),
  cost: z.number().describe("Base production cost in EUR."),
  margin: z.number().describe("Additional margin in EUR."),
});

export const baseConfigurationSchema = z.object({
  id: z.string().describe("Stable configuration identifier used in payloads."),
  name: translatedPropertySchema
    .required()
    .describe("Display name shown to users."),
  default: z
    .string()
    .optional()
    .describe("Default option identifier or default text."),
  required: z
    .boolean()
    .optional()
    .describe("Whether user input is required for this configuration."),
});

export const radioCardConfigurationSchema = baseConfigurationSchema.merge(
  z.object({
    type: z.literal("radio-card"),
    options: z
      .array(
        z.object({
          id: z.string().describe("Stable option identifier."),
          name: translatedPropertySchema
            .required()
            .describe("Option label shown in UI."),
          description: translatedPropertySchema
            .optional()
            .describe("Optional option help text."),
          price: pricePropertySchema.describe(
            "Pricing impact when this option is selected.",
          ),
        }),
      )
      .min(1)
      .describe("Selectable options for this radio-card configuration."),
  }),
);

export const textareaConfigurationSchema = baseConfigurationSchema.merge(
  z.object({
    type: z.literal("textarea"),
  }),
);

export const productSchema = z.object({
  slug: translatedPropertySchema
    .required()
    .describe(
      "Unique URL identifier. Please do NOT change this after the product is published. Do NOT use spaces and diacritics.",
    ),
  name: translatedPropertySchema
    .required()
    .describe("Customer-facing product name."),
  description: translatedPropertySchema
    .required()
    .describe("Customer-facing product description."),

  status: z
    .enum(["active", "draft"])
    .default("draft")
    .describe("Publication state of this product."),

  image: z.string().optional().describe("Optional hero image URL."),

  files: z.object({
    piecePerFile: z
      .boolean()
      .default(true)
      .describe(
        "Whether each file represents a single print (like in photos) or they all represent a single print (like in calendars).",
      ),
    min: z
      .number()
      .min(1)
      .optional()
      .describe("Minimum number of files allowed per item."),
    max: z
      .number()
      .optional()
      .describe("Maximum number of files allowed per item."),
  }),

  size: z.object({
    options: z
      .array(
        z.object({
          dimensions: z
            .array(z.number())
            .length(2)
            .describe(
              "[width, height] in millimeters. Must contain exactly two numbers.",
            ),
          common: z
            .boolean()
            .optional()
            .describe("Marks frequently selected dimensions in UI."),
        }),
      )
      .min(1)
      .describe("Available print size options."),
  }),

  configuration: z
    .array(radioCardConfigurationSchema.or(textareaConfigurationSchema))
    .describe("Additional configurable product options shown in order flow."),

  pricing: z
    .object({
      formula: z
        .string()
        .optional()
        .describe(
          "Pricing formula. Supports numbers, variables, +, -, *, /, ^ and parentheses. Example: size.area * 0.02 + files.totalPieces * 0.1 + configTotals.cost",
        ),
    })
    .optional()
    .default({})
    .describe(
      "Optional custom pricing configuration. Empty object means default pricing behavior.",
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
  price: z.number().optional(),
  pricing: z
    .object({
      formula: z.string().optional(),
    })
    .optional(),
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
      value: z.string().nullable(),
    }),
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

export type BaseConfiguration = z.infer<typeof baseConfigurationSchema>;
export type RadioCardConfiguration = z.infer<
  typeof radioCardConfigurationSchema
>;
export type TextareaConfiguration = z.infer<typeof textareaConfigurationSchema>;
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

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

export type ProductPayload = z.infer<typeof productSchema>;

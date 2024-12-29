import z from "zod";

export const productSchema = z.object({
  slug: z.string().min(5).max(50),
  name: z
    .object({
      sk: z.string().min(5),
      en: z.string().min(5),
    })
    .required(),
  description: z
    .object({
      sk: z.string(),
      en: z.string(),
    })
    .required(),
  image: z.string(),
  configuration: z.object({
    price: z.number(),
    weight: z.number(),
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      depth: z.number(),
    }),
  }),
});

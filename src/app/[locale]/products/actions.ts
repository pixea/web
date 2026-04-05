"use server";

import { auth } from "@/auth";
import db from "@/db";
import { products } from "@/db/schema";
import { productSchema, ProductPayload } from "@/db/validation";
import { error, noChanges, success } from "@/lib/utils";
import {
  generateText,
  GenerateTextResult,
  jsonSchema,
  JSONSchema7,
  Output,
  ToolSet,
} from "ai";
import { google } from "@ai-sdk/google";
import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const saveProductAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const session = await auth();
  const locale = await getLocale();

  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const id = formData.get("id") as string;
  const valuesString = formData.get("values") as string;

  if (!valuesString) {
    return noChanges();
  }

  const values = JSON.parse(valuesString) as ProductPayload;

  try {
    if (id) {
      await db.update(products).set(values).where(eq(products.id, id));
    } else {
      const product = await db
        .insert(products)
        .values(values)
        .returning({ id: products.id });

      redirect(`/${locale}/products/${product[0].id}`);
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return error("error", e);
  }

  return success();
};

export type GenerateProductDraftState = {
  result?: "success" | "error";
  message?: string;
  values?: string;
  issues?: string[];
};

const DEFAULT_GENERATE_PRODUCT_STATE: GenerateProductDraftState = {};
const DEFAULT_MODEL = "gemini-2.5-flash";

const productModelSchema = jsonSchema(
  productSchema.toJSONSchema() as JSONSchema7,
);
const MAX_GENERATION_ATTEMPTS = 2;

export const generateProductDraftAction = async (
  _prevState: GenerateProductDraftState = DEFAULT_GENERATE_PRODUCT_STATE,
  formData: FormData,
): Promise<GenerateProductDraftState> => {
  void _prevState;

  const session = await auth();
  const locale = await getLocale();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const prompt = (formData.get("prompt") as string | null)?.trim();
  const mode = formData.get("mode") === "update" ? "update" : "create";
  const currentValues = (formData.get("currentValues") as string | null) || "";

  if (!prompt) {
    return { result: "error", message: "Prompt is required." };
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return {
      result: "error",
      message:
        "Missing GOOGLE_GENERATIVE_AI_API_KEY. Configure it in your environment.",
    };
  }

  let baseProduct: unknown = {};
  if (mode === "update" && currentValues.trim()) {
    try {
      baseProduct = JSON.parse(currentValues);
    } catch {
      return {
        result: "error",
        message: "Current product JSON is invalid. Fix it before AI update.",
      };
    }
  }

  try {
    const basePromptPayload = {
      mode,
      request: prompt,
      existingProduct: mode === "update" ? baseProduct : undefined,
    };

    const systemPrompt = `You are an assistant that writes valid JSON for a print product catalog.
Return only data that matches the provided schema.
If mode is "update", keep existing values unless user explicitly asks to change them.
Use safe defaults when needed:
- status: "draft"
- include at least one size option
- every size option dimensions must be a tuple with exactly two numbers: [width, height]
- keep configuration as an array (can be empty)
- include files.piecePerFile
- include translated fields (sk, en) for slug, name, description`;

    let lastIssues: string[] = [];
    let previousFailedJson: string | undefined = undefined;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
      const response: GenerateTextResult<
        ToolSet,
        Output.Output<unknown, unknown, never>
      > =
        await generateText({
          model: google(
            process.env.GOOGLE_GENERATIVE_AI_MODEL || DEFAULT_MODEL,
          ),
          output: Output.object({ schema: productModelSchema }),
          providerOptions: {
            google: { structuredOutputs: true },
          },
          system: systemPrompt,
          prompt:
            attempt === 1 && !previousFailedJson
              ? JSON.stringify(basePromptPayload, null, 2)
              : JSON.stringify(
                  {
                    ...basePromptPayload,
                    correctionRequest:
                      "The previous attempt produced invalid JSON. Fix it so it validates against the schema. Return a full corrected object.",
                    previousFailedJson,
                    validationIssues: lastIssues,
                  },
                  null,
                  2,
                ),
          temperature: 0,
        });

      const parsed = productSchema.safeParse(response.output);

      if (parsed.success) {
        return {
          result: "success",
          values: JSON.stringify(parsed.data, null, 2),
        };
      }

      lastIssues = parsed.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`,
      );
      previousFailedJson = JSON.stringify(response.output);
    }

    return {
      result: "error",
      message: "AI response did not match the product schema.",
      issues: lastIssues,
    };
  } catch (err) {
    console.error(err);

    return {
      result: "error",
      message: "Unable to generate product draft right now.",
    };
  }
};

export const deleteProductAction = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/products`)}`);
  }

  const id = formData.get("id") as string;

  try {
    await db.delete(products).where(eq(products.id, id));
  } catch (e) {
    return error("error", e);
  }

  revalidatePath(`/${locale}/products/${id}`);

  return success();
};

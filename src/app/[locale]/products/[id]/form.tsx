"use client";

import { useActionState } from "react";
import { Button, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ZodStandardJSONSchemaPayload } from "zod/v4/core";

import BottomBar from "@/components/bottomBar";
import { ActionToasts } from "@/components/actionToasts";
import { productSchema } from "@/db/validation";

import { saveProductAction } from "../actions";
import MonacoInput from "@/components/monaco";

const ProductForm = ({
  id,
  schema,
  value,
}: {
  id?: string;
  schema: ZodStandardJSONSchemaPayload<typeof productSchema>;
  value: string;
}) => {
  const t = useTranslations("Products");

  const [actionState, action, actionPending] = useActionState(
    saveProductAction,
    { message: "" }
  );

  return (
    <form action={action}>
      <TextField.Root
        type="hidden"
        name="id"
        className="hidden"
        value={id === "new" ? "" : id}
      />

      <MonacoInput name="values" defaultValue={value} schema={schema} />

      <BottomBar justify="end">
        <Button
          type="submit"
          variant="solid"
          size="3"
          className="font-semibold"
          loading={actionPending}
        >
          {t("save")}
        </Button>
      </BottomBar>

      <ActionToasts state={actionState} />
    </form>
  );
};

export default ProductForm;

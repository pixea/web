"use client";

import { useActionState } from "react";
import { JsonSchema7Type } from "zod-to-json-schema";
import { Button, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

import BottomBar from "@/components/bottomBar";
import { ActionToasts } from "@/components/actionToasts";

import { saveProductAction } from "../actions";
import MonacoInput from "./monaco";

const ProductForm = ({
  id,
  schema,
  value,
}: {
  id?: string;
  schema: JsonSchema7Type;
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

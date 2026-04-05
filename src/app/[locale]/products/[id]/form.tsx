"use client";

import { useActionState, useState, useTransition } from "react";
import { Button, Callout, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ExclamationCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { ZodStandardJSONSchemaPayload } from "zod/v4/core";

import BottomBar from "@/components/bottomBar";
import { ActionToasts } from "@/components/actionToasts";
import { productSchema } from "@/db/validation";

import {
  generateProductDraftAction,
  GenerateProductDraftState,
  saveProductAction,
} from "../actions";
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
  const [prompt, setPrompt] = useState("");
  const [editorValue, setEditorValue] = useState(value);
  const [aiState, setAiState] = useState({} as GenerateProductDraftState);
  const [isGenerating, startGenerating] = useTransition();
  const mode = id === "new" ? "create" : "update";

  const [actionState, action, actionPending] = useActionState(
    saveProductAction,
    { message: "" }
  );

  const actionEditorValue = aiState.values ?? editorValue;
  const aiEditorKey = aiState.values ? `ai-${aiState.values}` : "base";

  return (
    <Flex direction="column" gap="4">
      <form
        action={(formData) => {
          startGenerating(async () => {
            const nextState = await generateProductDraftAction(undefined, formData);
            setAiState(nextState);

            if (nextState.result === "success" && nextState.values) {
              setEditorValue(nextState.values);
            }
          });
        }}
      >
        <Flex direction="column" gap="3">
          <Text as="label" size="2" weight="medium">
            {mode === "create" ? t("aiPromptCreate") : t("aiPromptUpdate")}
          </Text>

          <TextArea
            name="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={t("aiPromptPlaceholder")}
            rows={4}
          />

          <input type="hidden" name="mode" value={mode} />
          <input type="hidden" name="currentValues" value={actionEditorValue} />

          <Flex justify="between" align="center" gap="3" wrap="wrap">
            <Text size="1" color="gray">
              {t("aiHelp")}
            </Text>

            <Button
              type="submit"
              variant="soft"
              loading={isGenerating}
              disabled={!prompt.trim()}
            >
              <SparklesIcon className="size-4" />
              {mode === "create" ? t("generateDraft") : t("applyAiUpdate")}
            </Button>
          </Flex>
        </Flex>
      </form>

      {aiState.result === "error" ? (
        <Callout.Root variant="surface" color="red" role="alert">
          <Callout.Icon>
            <ExclamationCircleIcon className="size-4" />
          </Callout.Icon>
          <Callout.Text>
            {aiState.message}
            {aiState.issues?.length ? ` (${aiState.issues.join(", ")})` : ""}
          </Callout.Text>
        </Callout.Root>
      ) : null}

      <form action={action}>
        <TextField.Root
          type="hidden"
          name="id"
          className="hidden"
          value={id === "new" ? "" : id}
        />

        <MonacoInput
          key={aiEditorKey}
          name="values"
          defaultValue={actionEditorValue}
          onChangeValue={setEditorValue}
          schema={schema}
        />

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
    </Flex>
  );
};

export default ProductForm;

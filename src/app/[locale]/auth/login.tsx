"use client";

import { Button, Heading, Text, TextField } from "@radix-ui/themes";

import { socialLoginProviders } from "./social";
import { sendCodeAction } from "./actions";
import ErrorAlert from "./error-alert";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

const LogIn = ({ email }: { email?: string }) => {
  const t = useTranslations("Auth");
  const [state, formAction, pending] = useActionState(sendCodeAction, {
    result: "",
    message: "",
  });
  const params = useSearchParams();
  const redirectUrl = params.get("redirect");

  return (
    <>
      <Heading size="7">{t("title")}</Heading>

      <Text>{t("description")}</Text>

      <ErrorAlert code={state.result === "error" ? "Default" : undefined} />

      <form action={formAction}>
        <input type="hidden" name="lastPath" value={redirectUrl || ""} />

        <TextField.Root
          size="3"
          type="email"
          name="email"
          defaultValue={email}
          required
          placeholder={t("enterEmail")}
        />

        <Button
          size="3"
          type="submit"
          variant="solid"
          className="w-full mt-4"
          loading={pending}
        >
          {t("continue")}
        </Button>
      </form>

      <Text align="center">{t("or")}</Text>

      {socialLoginProviders.map(({ name, icon }) => (
        <Button
          key={name}
          variant="soft"
          color="gray"
          size="3"
          className="gap-2"
        >
          {icon} {t(name)}
        </Button>
      ))}
    </>
  );
};

export default LogIn;

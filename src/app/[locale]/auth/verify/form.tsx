"use client";

import { Button, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useState } from "react";

const VerifyForm = ({
  email,
  lastPath,
}: {
  email?: string;
  lastPath?: string;
}) => {
  const t = useTranslations("AuthVerify");
  // We produce a redirect on submit so can just keep it in loading state
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        setSubmitted(true);

        const formData = new FormData(event.target as HTMLFormElement);

        const redirectUrl = lastPath || "/order";

        const tokenInput = formData.get("token") as string;
        const email = formData.get("email") as string;

        if (typeof tokenInput !== "string" || typeof email !== "string") {
          throw new Error("Missing required properties");
        }

        const token = tokenInput.toUpperCase().replaceAll(/[^A-Z0-9]/g, "");

        // We are simulating real redirect to match email link click
        const path = `/api/auth/callback/resend?callbackUrl=${redirectUrl}&token=${token}&email=${email}`;
        window.location.href = path;
      }}
    >
      <TextField.Root
        size="3"
        type="hidden"
        name="email"
        value={email}
        className="hidden"
      />

      <TextField.Root
        size="3"
        type="text"
        name="token"
        required
        minLength={8}
        placeholder={t("enterCode")}
        className="[&_input]:uppercase [&_input]:font-medium [&_input]:placeholder:normal-case [&_input]:placeholder:font-normal"
      />

      <Button
        size="3"
        type="submit"
        variant="solid"
        className="w-full mt-4"
        loading={submitted}
      >
        {t("continue")}
      </Button>
    </form>
  );
};

export default VerifyForm;

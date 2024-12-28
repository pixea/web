"use client";

import { Button, TextField } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

const VerifyForm = ({ email }: { email?: string }) => {
  const t = useTranslations("AuthVerify");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        const lastUrl = "/en/order";

        const token = formData.get("token") as string;
        const email = formData.get("email") as string;

        // We are simulating real redirect to match email link click
        const path = `/api/auth/callback/resend?callbackUrl=${lastUrl}&token=${token}&email=${email}`;
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
        placeholder={t("enterCode")}
      />

      <Button size="3" type="submit" variant="solid" className="w-full mt-4">
        {t("continue")}
      </Button>
    </form>
  );
};

export default VerifyForm;

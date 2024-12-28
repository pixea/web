import { Button, Heading, Text, TextField } from "@radix-ui/themes";

import { socialLoginProviders } from "./social";
import { sendCode } from "./actions";
import ErrorAlert from "./error-alert";
import { useTranslations } from "next-intl";

const LogIn = ({ email }: { email?: string }) => {
  const t = useTranslations("Auth");

  return (
    <>
      <Heading size="7">{t("title")}</Heading>

      <Text>{t("description")}</Text>

      <ErrorAlert />

      <form action={sendCode}>
        <TextField.Root
          size="3"
          type="email"
          name="email"
          defaultValue={email}
          required
          placeholder={t("enterEmail")}
        />

        <Button size="3" type="submit" variant="solid" className="w-full mt-4">
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

import { Button, Heading, Text, TextField } from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { logout, saveAccount } from "./actions";

const Account = ({ session }: { session: Session }) => {
  const t = useTranslations("Auth");

  const name = session.user?.name;
  const hasName = !!name;

  return (
    <>
      <Heading>{hasName ? t("account", { name }) : t("welcome")}</Heading>

      <form action={saveAccount}>
        <Text as="label">
          {t("name")}
          <TextField.Root
            size="3"
            type="text"
            name="name"
            required
            placeholder={t("enterName")}
            defaultValue={name || undefined}
          />
        </Text>

        <Button size="3" type="submit" variant="solid" className="w-full mt-4">
          {t("save")}
        </Button>
      </form>

      <form action={logout}>
        <Button
          size="3"
          type="submit"
          variant="solid"
          color="gray"
          className="w-full mt-4"
        >
          {t("logout")}
        </Button>
      </form>
    </>
  );
};

export default Account;

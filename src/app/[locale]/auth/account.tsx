import { Button, Text, TextField, Tabs, Box } from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { logout, saveAccount } from "./actions";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline";

const Account = ({ session }: { session: Session }) => {
  const t = useTranslations("Auth");

  const name = session.user?.name;

  return (
    <>
      <Tabs.Root defaultValue="account">
        <Tabs.List>
          <Tabs.Trigger value="orders">Objednávky</Tabs.Trigger>
          <Tabs.Trigger value="account">Môj účet</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="orders">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>

          <Tabs.Content value="account">
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

              <Button
                size="3"
                type="submit"
                variant="solid"
                className="w-full mt-4"
              >
                {t("save")}
              </Button>
            </form>

            <form action={logout}>
              <Button
                size="3"
                type="submit"
                variant="solid"
                color="red"
                className="w-full mt-4 gap-1.5"
              >
                <ArrowLeftEndOnRectangleIcon className="size-4" /> {t("logout")}
              </Button>
            </form>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
};

export default Account;

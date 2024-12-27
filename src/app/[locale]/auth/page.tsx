import { signIn } from "@/auth";
import { cookies } from "next/headers";
import {
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";

const AuthPage = async () => {
  const t = await getTranslations("Auth");
  const cookieStore = await cookies();

  return (
    <Flex direction="column" gap="4" mt="4">
      <Container size="1">
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="7">{t("title")}</Heading>

            <Text>{t("description")}</Text>

            <form
              action={async (formData) => {
                "use server";

                const cookieStore = await cookies();
                cookieStore.set("email", formData.get("email") as string);

                await signIn("resend", formData);
              }}
            >
              <TextField.Root
                size="3"
                type="email"
                name="email"
                defaultValue={cookieStore.get("email")?.value}
                required
                placeholder={t("enterEmail")}
              />

              <Button
                size="3"
                type="submit"
                variant="solid"
                className="w-full mt-4"
              >
                {t("continue")}
              </Button>
            </form>

            <Text align="center">{t("or")}</Text>

            <Button variant="soft" color="red" size="3">
              {t("google")}
            </Button>
            <Button variant="soft" color="gray" size="3">
              {t("apple")}
            </Button>
            <Button variant="soft" color="indigo" size="3">
              {t("facebook")}
            </Button>
          </Flex>
        </Card>
      </Container>
    </Flex>
  );
};

export default AuthPage;

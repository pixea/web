import { cookies } from "next/headers";
import { Button, Card, Container, Flex, Heading, Text } from "@radix-ui/themes";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import VerifyForm from "./form";

const AuthVerifyPage = async () => {
  const t = await getTranslations("AuthVerify");
  const cookieStore = await cookies();

  return (
    <Container size="1" className="w-full justify-center">
      <Card>
        <Flex direction="column" gap="4" className="p-6 px-2.5 xs:px-4 sm:px-6">
          <Heading size="7">{t("title")}</Heading>

          <Text>
            {t("description", { email: cookieStore.get("email")?.value })}
          </Text>

          <VerifyForm email={cookieStore.get("email")?.value} />
        </Flex>
      </Card>

      <Flex justify="center">
        <Button
          size="3"
          color="gray"
          variant="ghost"
          className="mt-4 w-20"
          asChild
        >
          <Link href="/auth">
            <ArrowLeftIcon className="size-4" /> {t("back")}
          </Link>
        </Button>
      </Flex>
    </Container>
  );
};

export default AuthVerifyPage;

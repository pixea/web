import { cookies } from "next/headers";
import { Card, Container, Flex, Heading, Text, Badge } from "@radix-ui/themes";

import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import LogIn from "./login";
import Profile from "./account";
import { cn } from "@/lib/utils";

const AuthPage = async () => {
  const t = await getTranslations("Auth");

  const cookieStore = await cookies();

  const session = await auth();

  const name = session?.user?.name;
  const role = session?.user?.role;

  return (
    <Container
      size={session ? undefined : "1"}
      className={cn("w-full", session ? "mt-7" : "justify-center")}
    >
      {session ? (
        <Flex direction="column">
          <Text
            size="3"
            color="gray"
            className="flex items-center gap-1.5 uppercase"
          >
            {t("my")} Pixea{" "}
            {role === "admin" ? (
              <Badge variant="solid" size="1" color="yellow" radius="full">
                ADMIN
              </Badge>
            ) : undefined}
          </Text>
          <Heading size="7">{name}</Heading>
        </Flex>
      ) : undefined}

      <Card className="w-full mt-10" style={{ contain: "none" }}>
        <Flex
          direction="column"
          gap="4"
          className={session ? "pb-3.5 px-3" : "p-6 px-2.5 xs:px-4 sm:px-6"}
        >
          {session ? (
            <Profile session={session} />
          ) : (
            <LogIn email={cookieStore.get("email")?.value} />
          )}
        </Flex>
      </Card>
    </Container>
  );
};

export default AuthPage;

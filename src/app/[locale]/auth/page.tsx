import { cookies } from "next/headers";
import { Card, Container, Flex } from "@radix-ui/themes";

import { auth } from "@/auth";
import LogIn from "./login";
import Profile from "./profile";

const AuthPage = async () => {
  const cookieStore = await cookies();

  const session = await auth();

  return (
    <Flex direction="column" gap="4" mt="4">
      <Container size="1">
        <Card>
          <Flex direction="column" gap="4" p="3">
            {session ? (
              <Profile session={session} />
            ) : (
              <LogIn email={cookieStore.get("email")?.value} />
            )}
          </Flex>
        </Card>
      </Container>
    </Flex>
  );
};

export default AuthPage;

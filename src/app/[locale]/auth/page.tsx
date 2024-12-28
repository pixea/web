import { cookies } from "next/headers";
import { Card, Container, Flex } from "@radix-ui/themes";

import { auth } from "@/auth";
import LogIn from "./login";
import Profile from "./account";

const AuthPage = async () => {
  const cookieStore = await cookies();

  const session = await auth();

  return (
    <Container size="1" className="w-full justify-center">
      <Card className="w-full">
        <Flex direction="column" gap="4" className="p-6 px-2.5 xs:px-4 sm:px-6">
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

import { cookies } from "next/headers";
import { Card, Container, Flex, Heading } from "@radix-ui/themes";

import { auth } from "@/auth";
import LogIn from "./login";
import Profile from "./account";
import { cn } from "@/lib/utils";

const AuthPage = async () => {
  const cookieStore = await cookies();

  const session = await auth();

  return (
    <Container
      size={session ? undefined : "1"}
      className={cn("w-full", session ? "mt-4" : "justify-center")}
    >
      {session ? <Heading size="7">Moja Pixea</Heading> : ""}

      <Card className="w-full mt-4">
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

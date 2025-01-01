import { Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import UsersTable from "./table";
import db from "@/db";
import { users as usersSchema } from "@/db/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";

const UsersPage = async () => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/users`)}`);
  }

  const t = await getTranslations("Users");

  const users = await db
    .select()
    .from(usersSchema)
    .orderBy(desc(usersSchema.created));

  return (
    <Container className="w-full" mt="4">
      <Flex direction="column" gap="4" mt="4">
        <Heading size="7">{t("title")}</Heading>

        <UsersTable users={users} />
      </Flex>
    </Container>
  );
};

export default UsersPage;

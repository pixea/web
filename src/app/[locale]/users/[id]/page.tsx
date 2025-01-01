import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { getLocale, getTranslations } from "next-intl/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { zodToJsonSchema } from "zod-to-json-schema";

import { auth } from "@/auth";
import { Link } from "@/i18n/routing";
import db from "@/db";
import { users } from "@/db/schema";
import { userSchema } from "@/db/validation";
import UserForm from "./form";

const UserEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const locale = await getLocale();
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect(`/auth?redirect=${encodeURIComponent(`/${locale}/users`)}`);
  }

  const t = await getTranslations("Users");

  const { id } = await params;
  const user = await db.query.users.findFirst({ where: eq(users.id, id) });

  if (!user) {
    redirect("/users");
  }

  const value = JSON.stringify(
    {
      ...user,
      id: undefined,
      created: undefined,
      updated: undefined,
    },
    null,
    2
  );

  return (
    <Container className="w-full" mt="4">
      <Flex direction="column" gap="4" mt="4">
        <Flex
          direction="row"
          justify="between"
          align="center"
          gap="4"
          wrap="wrap"
        >
          <Heading size="7">{t("title")}</Heading>

          <Button asChild color="gray" variant="ghost" size="2">
            <Link href="/users" className="flex items-center gap-1.5">
              <ArrowUturnLeftIcon className="size-4" />
              {t("back")}
            </Link>
          </Button>
        </Flex>

        <UserForm id={id} value={value} schema={zodToJsonSchema(userSchema)} />
      </Flex>
    </Container>
  );
};

export default UserEditPage;

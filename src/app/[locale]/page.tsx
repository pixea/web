import { Link } from "@/i18n/routing";
import { Flex, Heading, Button } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <Flex direction="column" gap="5" align="center" justify="center" mt="8">
        <Heading size="9" align="center" className="font-semibold">
          {t("title")}
        </Heading>
        <Flex direction="row" gap="2">
          <Button variant="solid">
            <Link href="/order">{t("button1")}</Link>
          </Button>
          <Button variant="soft">{t("button2")}</Button>
        </Flex>
      </Flex>
      <video className="mt-8 w-full rounded-6" autoPlay muted loop playsInline>
        <source src="/xmas.mp4" type="video/mp4" />
        {t("video")}
      </video>
    </>
  );
}

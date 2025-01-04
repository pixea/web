import { Link } from "@/i18n/routing";
import { Flex, Heading, Button, Container } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import MoreProducts from "./product/[slug]/more-products";

export default function Home() {
  const t = useTranslations("Home");

  return (
    <>
      <Container>
        <Flex
          direction="column"
          gap="6"
          align="center"
          justify="center"
          className="mt-16 md:mt-24 mb-6"
        >
          <Heading
            align="center"
            className="font-semibold text-5xl xs:text-7xl md:text-8xl"
          >
            {t("title")}
          </Heading>

          <Button variant="solid" size="4">
            <Link href="/order">{t("button1")}</Link>
          </Button>
        </Flex>
      </Container>

      <MoreProducts showHeading={false} columns="4" />
    </>
  );
}

import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Grid, Container } from "@radix-ui/themes";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import ProductPreview, { Product } from "./product";

const OrderItemSelectionPage = () => {
  const t = useTranslations("OrderItemSelection");

  const options = [
    {
      id: "xxx1",
      name: {
        en: "Photo",
        sk: "Fotografia",
      },
      desc: {
        en: "from 9x13cm, $500",
        sk: "od 9x13cm, 500€",
      },
      image: "photo.jpg",
    },
    {
      id: "xxx2",
      name: {
        en: "Panel",
        sk: "Panel",
      },
      desc: {
        en: "from 15x20cm, $1000",
        sk: "od 15x20cm, 1000€",
      },
      image: "panel.jpg",
    },
    {
      id: "xxx3",
      name: {
        en: "Canvas",
        sk: "Plátno",
      },
      desc: {
        en: "from 15x20cm, $2000",
        sk: "od 15x20cm, 2000€",
      },
      image: "canvas.jpg",
    },
    {
      id: "xxx4",
      name: {
        en: "Custom",
        sk: "Na požiadanie",
      },
      desc: {
        en: "pricing will be specified",
        sk: "cena bude upresnená",
      },
      image: "custom.jpg",
    },
  ] as Product[];

  return (
    <Container className="w-full" mt="4">
      <Flex direction="row" justify="between" align="center">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Grid
        columns={{
          initial: "1",
          xs: "2",
          sm: "3",
          md: "4",
        }}
        gap="4"
        width="full"
        mt="4"
      >
        {options.map((option) => (
          <ProductPreview key={option.id} product={option} />
        ))}
      </Grid>
    </Container>
  );
};

export default OrderItemSelectionPage;

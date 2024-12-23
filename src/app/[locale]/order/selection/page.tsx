import { Link } from "@/i18n/routing";
import { Button, Flex, Box, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const OrderItemSelectionPage = () => {
  const t = useTranslations("OrderItemSelection");
  const locale = useLocale();

  const options = [
    {
      id: "xxx1",
      name: {
        en: "Photo",
        sk: "Fotografia",
      },
      image: "photo.jpg",
    },
    {
      id: "xxx2",
      name: {
        en: "Panel",
        sk: "Panel",
      },
      image: "panel.jpg",
    },
    {
      id: "xxx3",
      name: {
        en: "Canvas",
        sk: "Plátno",
      },
      image: "canvas.jpg",
    },
    {
      id: "xxx4",
      name: {
        en: "Custom",
        sk: "Na požiadanie",
      },
      image: "custom.jpg",
    },
  ] as { id: string; name: Record<string, string>; image: string }[];

  return (
    <Flex direction="column" gap="2" mt="4">
      <Flex direction="row" justify="between" align="center">
        <Heading>{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order">{t("back")}</Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="2" width="full" mt="4">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            color="gray"
            className="h-auto text-left justify-start p-5"
          >
            <Flex direction="column" width="full">
              <Text weight="bold" className="z-10">
                {option.name[locale]}
              </Text>

              <Box className="absolute w-full h-full bg-gradient-to-b from-[#000/0] to-[#000/75]" />
              <Image
                src={`/products/${option.image}`}
                alt=""
                width={300}
                height={100}
                className="absolute object-cover -z-10"
              />
            </Flex>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
export default OrderItemSelectionPage;

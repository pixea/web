import { Link } from "@/i18n/routing";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";

const OrderItem = () => {
  const t = useTranslations("OrderItem");
  const locale = useLocale();

  const options = [
    {
      id: "xxx1",
      name: {
        en: "Photo",
        sk: "Fotografia",
      },
    },
    {
      id: "xxx2",
      name: {
        en: "Canvas",
        sk: "Plátno",
      },
    },
    {
      id: "xxx3",
      name: {
        en: "Custom",
        sk: "Na požiadanie",
      },
    },
  ] as { id: string; name: Record<string, string> }[];

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
              <Text weight="bold">{option.name[locale]}</Text>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
export default OrderItem;

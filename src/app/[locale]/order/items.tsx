import { Link } from "@/i18n/routing";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Box, Button, Card, Flex, Separator, Text } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";

const OrderItems = () => {
  const t = useTranslations("Order");
  const format = useFormatter();

  const items = [
    {
      id: "099",
      name: "Fotografia",
      dimensions: [10, 15],
      pieces: 4,
      price: 42,
    },
    {
      id: "66",
      name: "Panel",
      dimensions: [10, 15],
      pieces: 4,
      price: 12,
    },
    {
      id: "54",
      name: "Panel",
      dimensions: [10, 15],
      pieces: 4,
      price: 34,
    },
    {
      id: "34",
      name: "Platno",
      dimensions: [10, 15],
      pieces: 4,
      price: 22,
    },
    {
      id: "23",
      name: "Custom",
      dimensions: [10, 15],
      pieces: 4,
      price: 18,
    },
  ];

  return (
    <Flex direction="column" gap="5" mb="2" className="w-full">
      {!items.length && (
        <Flex
          justify="center"
          align="center"
          className="flex-1 border border-dashed border-gray-8 p-6 rounded-3 text-gray-10"
        >
          <Text size="4">{t("empty")}</Text>
        </Flex>
      )}

      {items.map((item, index) => (
        <Flex
          key={item.id}
          direction="row"
          gap="4"
          align="center"
          className="w-full"
        >
          <Card size="2" className="flex-1" asChild>
            <Link href="/">
              <Flex justify="between">
                <Flex justify="center" gap="2">
                  <Box>
                    <Text size="5">#{index + 1}</Text>
                  </Box>
                  <Box>
                    <Text size="3" weight="bold" highContrast>
                      {item.name}
                    </Text>
                    <Text as="div" size="2">
                      Rozmer: {item.dimensions.join(" × ")} cm
                    </Text>
                    <Text as="div" size="2">
                      Pocet: {item.pieces} ks
                    </Text>
                  </Box>
                </Flex>

                <Flex align="center" justify="end" gap="5" flexGrow="1">
                  <Separator orientation="vertical" size="3" />
                  <Box minWidth="70px">
                    <Text as="div" size="2" color="gray">
                      Cena
                    </Text>
                    <Text as="div" size="4" weight="bold">
                      {format.number(item.price, {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Link>
          </Card>
          <Button
            variant="ghost"
            color="red"
            size="2"
            asChild
            className="p-2 rounded-full"
          >
            <XMarkIcon className="size-6" />
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};

export default OrderItems;

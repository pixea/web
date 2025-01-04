import { Link } from "@/i18n/routing";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Card,
  Flex,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";

const OrderItems = () => {
  const t = useTranslations("Order");
  const format = useFormatter();

  const items = [
    {
      id: "099",
      name: "Fotografia",
      dimensions: [10, 15],
      quantity: 4,
      price: 42,
    },
    {
      id: "66",
      name: "Panel",
      dimensions: [10, 15],
      quantity: 4,
      price: 12,
    },
    {
      id: "54",
      name: "Panel",
      dimensions: [10, 15],
      quantity: 4,
      price: 34,
    },
    {
      id: "34",
      name: "Platno",
      dimensions: [10, 15],
      quantity: 4,
      price: 22,
    },
    {
      id: "23",
      name: "Custom",
      dimensions: [10, 15],
      quantity: 4,
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
                  <Flex direction="column" gap="1">
                    <Text size="3" weight="bold" highContrast>
                      {item.name}
                    </Text>
                    <Flex
                      direction="row"
                      align="start"
                      gapX="5"
                      gapY="2"
                      wrap="wrap"
                      pr="5"
                    >
                      <Text as="div" size="2" className="flex flex-col">
                        <Text className="text-gray-11">{t("dimensions")}:</Text>{" "}
                        {item.dimensions.join(" × ")} cm
                      </Text>
                      <Text as="div" size="2" className="flex flex-col">
                        <Text className="text-gray-11">{t("quantity")}:</Text>{" "}
                        {item.quantity} {t("quantityUnit")}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex
                  align="center"
                  justify="end"
                  flexGrow="1"
                  gap="4"
                  className="xs:gap-5"
                >
                  <Separator orientation="vertical" size="4" />
                  <Box minWidth="70px">
                    <Text as="div" size="2" color="gray">
                      {t("price")}
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

          <Tooltip content={t("remove")}>
            <Button
              variant="ghost"
              color="red"
              size="2"
              asChild
              className="p-2 rounded-full hover:cursor-pointer"
            >
              <XMarkIcon className="size-6" />
            </Button>
          </Tooltip>
        </Flex>
      ))}
    </Flex>
  );
};

export default OrderItems;

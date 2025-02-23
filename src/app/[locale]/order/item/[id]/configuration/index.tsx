import { Product } from "@/db/schema";
import { OrderItemPayload } from "@/db/validation";
import { Locales } from "@/i18n/locales";
import { Flex, Heading } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import RadioCardRenderer from "./radio-card";
import TextAreaRenderer from "./textarea";

type Props = {
  product: Product;
  values?: OrderItemPayload["configuration"];
  onChange: (value: OrderItemPayload["configuration"][0]) => void;
};

const renderers = {
  "radio-card": RadioCardRenderer,
  textarea: TextAreaRenderer,
} as const;

const Configuration = ({ product, values, onChange }: Props) => {
  const t = useTranslations("OrderItem");
  const locale = useLocale() as Locales;

  const { configuration } = product;

  console.log({ configuration });

  return (
    <Flex direction="column" gap="4" width="full">
      {/* Size configuration is built-in - has to be always there */}
      <Flex direction="column" gap="2" key="size">
        <Heading as="h3" size="3">
          {t("size")}
        </Heading>
      </Flex>

      {configuration.map((config) => (
        <Flex direction="column" gap="2" key={config.id}>
          <Heading as="h3" size="3">
            {config.name[locale]}
          </Heading>

          {renderers[config.type]({
            // @ts-expect-error Config type-safety is guaranteed by the config.type
            config,
            value: values?.find((value) => value.id === config.id),
            onChange: (value) => onChange({ id: config.id, value }),
          })}
        </Flex>
      ))}
    </Flex>
  );
};

export default Configuration;

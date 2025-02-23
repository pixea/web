import { RadioCardConfiguration } from "@/db/validation";
import { Locales } from "@/i18n/locales";
import { Flex, RadioCards, Text } from "@radix-ui/themes";
import { useFormatter, useLocale } from "next-intl";

interface Props {
  config: RadioCardConfiguration;
  value?: string | null;
  onChange: (value: string | null) => void;
}

const RadioCardRenderer = ({ config, value, onChange }: Props) => {
  const locale = useLocale() as Locales;
  const format = useFormatter();

  const defaultValue = value || config.default || undefined;

  return (
    <RadioCards.Root
      columns={{ initial: "2", xs: "3", sm: "4", md: "3" }}
      defaultValue={defaultValue}
      onValueChange={(selectedId) => onChange(selectedId)}
    >
      {config.options.map((option) => (
        <RadioCards.Item key={option.id} value={option.id}>
          <Flex direction="column" width="100%">
            <Text weight="bold">{option.name[locale]}</Text>
            <Text>
              +{" "}
              {format.number(option.price.cost, {
                style: "currency",
                currency: "EUR",
              })}
            </Text>
          </Flex>
        </RadioCards.Item>
      ))}
    </RadioCards.Root>
  );
};

export default RadioCardRenderer;

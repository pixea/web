import { Flex, RadioCards, Text } from "@radix-ui/themes";
import { useFormatter, useLocale } from "next-intl";
import { BaseProductConfiguration } from "./form";

export type RadioCardConfiguration = BaseProductConfiguration & {
  type: "radio-card";
  options: {
    id: string;
    name: Record<string, string>;
    price: number;
  }[];
};

interface Props {
  config: RadioCardConfiguration;
  onChange: (option?: RadioCardConfiguration["options"][0]) => void;
}

const RadioCardRenderer = ({ config, onChange }: Props) => {
  const locale = useLocale();
  const format = useFormatter();

  return (
    <RadioCards.Root
      columns={{ initial: "2", sm: "3", md: "4" }}
      onValueChange={(selectedId) =>
        onChange(config.options.find(({ id }) => id === selectedId))
      }
    >
      {config.options.map((option) => (
        <RadioCards.Item key={option.id} value={option.id}>
          <Flex direction="column" width="100%">
            <Text weight="bold">{option.name[locale]}</Text>
            <Text>
              +{" "}
              {format.number(option.price, {
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

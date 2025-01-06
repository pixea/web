import { Flex, RadioCards, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";
import { BaseProductConfiguration } from "./form";

export type SizeConfiguration = BaseProductConfiguration & {
  type: "size";
  options: {
    dimensions: [number, number];
    other?: true;
    price: number;
  }[];
};

interface Props {
  config: SizeConfiguration;
  onChange: (option?: SizeConfiguration["options"][0]) => void;
}

const SizeRenderer = ({ config, onChange }: Props) => {
  const format = useFormatter();

  return (
    <RadioCards.Root
      columns={{ initial: "2", sm: "3", md: "4" }}
      onValueChange={(selectedId) =>
        onChange(
          config.options.find(
            ({ dimensions }) => dimensions.join("x") === selectedId
          )
        )
      }
    >
      {config.options.map(({ dimensions, price }) => (
        <RadioCards.Item
          key={dimensions.join("x")}
          value={dimensions.join("x")}
        >
          <Flex direction="column" width="100%">
            <Text weight="bold">
              {dimensions[0]}x{dimensions[1]} cm
            </Text>
            <Text>
              +{" "}
              {format.number(price, {
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

export default SizeRenderer;

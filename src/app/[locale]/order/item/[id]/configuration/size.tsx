import { Product } from "@/db/schema";
import { Flex, RadioCards, Text } from "@radix-ui/themes";
import { useFormatter } from "next-intl";

interface Props {
  config: Product["size"];
  onChange: (dimensions: [number, number]) => void;
}

const SizeRenderer = ({ config, onChange }: Props) => {
  const format = useFormatter();

  return (
    <RadioCards.Root
      columns={{ initial: "2", sm: "3", md: "4" }}
      onValueChange={(selectedId) => {
        const dimensions = selectedId.split("x").map(Number) as [
          number,
          number,
        ];

        onChange(dimensions);
      }}
    >
      {config.options.map(({ dimensions }) => (
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
              {format.number(999, {
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

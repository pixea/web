import { Flex, Heading } from "@radix-ui/themes";

const Configuration = () => {
  return (
    <Flex direction="column" gap="4" width="full">
      {/* {configuration.map((config) => (
          <Flex direction="column" gap="2" key={config.id}>
            <Heading as="h3" size="3">
              {config.name[locale]}
            </Heading>

            {renderers[config.type]({
              config,
              onChange: (option) => option?.price && setPrice(option.price),
            })}
          </Flex>
        ))} */}
    </Flex>
  );
};

export default Configuration;

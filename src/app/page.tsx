import { Button, Flex, Text } from "@radix-ui/themes";

export default function Home() {
  return (
    <Flex direction="column" gap="2">
      <Text>Hello from Radix Themes :)</Text>
      <Button size="4">Let&apos;s go</Button>
    </Flex>
  );
}

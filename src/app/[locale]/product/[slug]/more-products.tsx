import { Grid, Flex, Heading, Text } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

export default function MoreProducts() {
  return (
    <Flex direction="column">
      <Heading size="9" className="font-semibold">
        Other
      </Heading>

      <Grid
        columns={{ initial: "1", sm: "2", md: "3" }}
        className="gap-12 mt-8"
      >
        <Link href="/product/photo-print" className="group">
          <Flex direction="column" gap="5">
            <Flex direction="row" justify="between" gap="4">
              <Heading
                size="7"
                weight="medium"
                className="group-hover:underline"
              >
                Photo Panels
              </Heading>
              <Text size="7">→</Text>
            </Flex>

            <Flex className="relative w-full h-[360]">
              <Image
                src="/products/panel.jpg"
                width="347"
                height="360"
                alt=""
                className="w-full h-full object-cover rounded-2"
              />

              <Flex className="absolute inset-0 bg-blue-9 mix-blend-multiply rounded-2"></Flex>
            </Flex>
          </Flex>
        </Link>

        <Link href="/product/photo-print" className="group">
          <Flex direction="column" gap="5">
            <Flex direction="row" justify="between" gap="4">
              <Heading
                size="7"
                weight="medium"
                className="group-hover:underline"
              >
                Canvas Print
              </Heading>
              <Text size="7">→</Text>
            </Flex>

            <Flex className="relative w-full h-[360]">
              <Image
                src="/products/canvas.jpg"
                width="347"
                height="360"
                alt=""
                className="w-full h-full object-cover rounded-2"
              />

              <Flex className="absolute inset-0 bg-blue-9 mix-blend-multiply rounded-2"></Flex>
            </Flex>
          </Flex>
        </Link>

        <Link href="/product/photo-print" className="group">
          <Flex direction="column" gap="5">
            <Flex direction="row" justify="between" gap="4">
              <Heading
                size="7"
                weight="medium"
                className="group-hover:underline"
              >
                Photo Magnets
              </Heading>
              <Text size="7">→</Text>
            </Flex>

            <Flex className="relative w-full h-[360]">
              <Image
                src="/products/custom.jpg"
                width="347"
                height="360"
                alt=""
                className="w-full h-full object-cover rounded-2"
              />

              <Flex className="absolute inset-0 bg-blue-9 mix-blend-multiply rounded-2"></Flex>
            </Flex>
          </Flex>
        </Link>
      </Grid>
    </Flex>
  );
}

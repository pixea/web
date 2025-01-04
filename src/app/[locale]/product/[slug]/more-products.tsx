import { cn } from "@/lib/utils";
import { Grid, Flex, Heading, Text } from "@radix-ui/themes";
import { link } from "fs";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    name: "Photo Print",
    image: "/products/photo.jpg",
    link: "/product/photo-print",
  },
  {
    name: "Photo Panels",
    image: "/products/panel.jpg",
    link: "/product/photo-print",
  },
  {
    name: "Canvas Print",
    image: "/products/canvas.jpg",
    link: "/product/photo-print",
  },
];

interface MoreProductsProps {
  showHeading: boolean;
  columns: "3" | "4";
}

export default function MoreProducts({
  showHeading,
  columns,
}: MoreProductsProps) {
  return (
    <Flex direction="column">
      {showHeading && (
        <Heading size="9" className="font-semibold">
          Other
        </Heading>
      )}

      <Grid
        columns={{ initial: "1", sm: "2", md: columns }}
        className="gap-12 mt-8"
      >
        {products.map((product, index) => (
          <Link
            key={product.name}
            href={product.link}
            className="group mt-6 hover:mt-0 transition-all"
          >
            <Flex direction="column" gap="5">
              <Flex direction="row" justify="between" gap="4">
                <Heading
                  size="7"
                  weight="medium"
                  className="group-hover:underline"
                >
                  {product.name}
                </Heading>
                <Text size="7">→</Text>
              </Flex>

              <Flex className="relative w-full h-[360]">
                <Image
                  src={product.image}
                  width="347"
                  height="360"
                  alt=""
                  className={cn(
                    "w-full h-full object-cover rounded-2 group-hover:shadow-2xl transition-all",
                    {
                      "group-hover:shadow-blue-9": index === 0,
                      "group-hover:shadow-pink-9": index === 1,
                      "group-hover:shadow-yellow-9": index === 2,
                      "group-hover:shadow-gray-9": index === 3,
                    }
                  )}
                />

                {/* <Flex
                  className={`absolute inset-0 group-hover:bg-${product.color}-9 mix-blend-overlay rounded-2 transition-all`}
                ></Flex> */}
              </Flex>
            </Flex>
          </Link>
        ))}

        <Link
          href="/product/photo-print"
          className="mt-6 group hover:mt-0 transition-all"
        >
          <Flex direction="column" gap="5">
            <Flex direction="row" justify="between" gap="4">
              <Heading
                size="7"
                weight="medium"
                className="group-hover:underline"
              >
                Much more
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

              <Flex className="absolute inset-0 group-hover:bg-gray-9 mix-blend-overlay rounded-2 transition-all"></Flex>
            </Flex>
          </Flex>
        </Link>
      </Grid>
    </Flex>
  );
}

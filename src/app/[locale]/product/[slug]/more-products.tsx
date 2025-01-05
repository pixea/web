"use client";

import { cn } from "@/lib/utils";
import { Grid, Flex, Heading, Text, Box, Container } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  background: boolean;
}

export default function MoreProducts({
  showHeading,
  columns,
  background,
}: MoreProductsProps) {
  const [color, setColor] = useState("bg-blue-9");

  return (
    <>
      <Container>
        <Flex direction="column" className="mb-16">
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
                className="group mt-2.5 hover:mt-0 transition-all"
                onMouseOver={() =>
                  index === 0
                    ? setColor("bg-blue-9")
                    : index === 1
                      ? setColor("bg-pink-9")
                      : index === 2
                        ? setColor("bg-yellow-9")
                        : setColor("bg-gray-12")
                }
                onMouseOut={() => setColor("bg-blue-9")}
              >
                <Flex direction="column" gap="5">
                  <Flex direction="row" justify="between" gap="4">
                    <Heading
                      size="7"
                      weight="medium"
                      className={cn(
                        "group-hover:underline underline-offset-8",
                        {
                          "group-hover:text-blue-9 group-hover:decoration-blue-5":
                            index === 0,
                          "group-hover:text-pink-9 group-hover:decoration-pink-5":
                            index === 1,
                          "group-hover:text-yellow-9 group-hover:decoration-yellow-5":
                            index === 2,
                        }
                      )}
                    >
                      {product.name}
                    </Heading>
                    <Text
                      size="7"
                      className={cn("transition-all", {
                        "group-hover:text-blue-9": index === 0,
                        "group-hover:text-pink-9": index === 1,
                        "group-hover:text-yellow-9": index === 2,
                      })}
                    >
                      →
                    </Text>
                  </Flex>

                  <Flex className="relative w-full h-[360]">
                    <Image
                      src={product.image}
                      width="347"
                      height="360"
                      alt=""
                      className={cn(
                        "w-full h-full object-cover rounded-2 transition-all",
                        {
                          "group-hover:ring-blue-2": index === 0,
                          "group-hover:ring-pink-2 ": index === 1,
                          "group-hover:ring-yellow-2": index === 2,
                          "group-hover:ring-gray-2": index === 3,
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
              className="group mt-2.5 hover:mt-0 transition-all"
              onMouseOver={() => setColor("bg-gray-12")}
              onMouseOut={() => setColor("bg-blue-9")}
            >
              <Flex direction="column" gap="5">
                <Flex direction="row" justify="between" gap="4">
                  <Heading
                    size="7"
                    weight="medium"
                    className="group-hover:underline underline-offset-8 group-hover:text-gray-12 group-hover:decoration-gray-5"
                  >
                    Much more
                  </Heading>
                  <Text
                    size="7"
                    className="transition-all group-hover:text-gray-11"
                  >
                    →
                  </Text>
                </Flex>

                <Flex className="relative w-full h-[360]">
                  <Image
                    src="/products/custom.jpg"
                    width="347"
                    height="360"
                    alt=""
                    className="w-full h-full object-cover rounded-2 group-hover:ring-gray-2 transition-all"
                  />

                  {/* <Flex
                  className={`absolute inset-0 group-hover:bg-${product.color}-9 mix-blend-overlay rounded-2 transition-all`}
                ></Flex> */}
                </Flex>
              </Flex>
            </Link>
          </Grid>
        </Flex>
      </Container>

      {background && (
        <Box
          className={cn(
            "hidden md:block absolute -z-50 top-[580] w-full h-[360] transition-all",
            color
          )}
        />
      )}
    </>
  );
}

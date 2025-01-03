"use client";

import { Container, Flex, Grid, Heading, Text, Button } from "@radix-ui/themes";
import Image from "next/image";
import { useState } from "react";

import { useTranslations } from "next-intl";
import {
  ArrowsPointingOutIcon,
  ClockIcon,
  PencilIcon,
  PrinterIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";

const sizes = [
  "9 x 13",
  "10 x 15",
  "13 x 18",
  "15 x 21",
  "18 x 24",
  "20 x 30",
  "24 x 30",
  "30 x 40",
  "40 x 50",
  "50 x 70",
  "70 x 100",
  "100 x 150",
];

const features = [
  {
    name: "High-Quality Print",
    description: "Vibrant colors and sharp details",
    icon: PrinterIcon,
  },
  {
    name: "Paper and Finish Options",
    description: "Glossy, matte, and more",
    icon: Square3Stack3DIcon,
  },
  {
    name: "Customization and Editing Tools",
    description: "Crop, rotate, and more",
    icon: PencilIcon,
  },
  {
    name: "Durability and Longevity",
    description: "Lasts a lifetime",
    icon: ClockIcon,
  },
];

export default function PageSlug() {
  const t = useTranslations("Photo");

  const [showAll, setShowAll] = useState(false);

  return (
    <Container className="w-full" mt={{ initial: "0", sm: "4", md: "8" }}>
      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="gap-10 sm:gap-14 md:gap-16 lg:gap-20"
      >
        <Flex direction="column" gap="3">
          <Flex className="w-full sm:w-[360] md:w-[480] h-[320] xs:h-[480] sm:h-[560]">
            <Image
              src="/products/photo.jpg"
              width="740"
              height="560"
              alt="Photo"
              className="object-cover rounded-2"
            />
          </Flex>

          <Flex direction="row" gap="3">
            <Flex className="w-full sm:w-[173] md:w-[234] h-[140] xs:h-[234]">
              <Image
                src="/products/photo.jpg"
                width="740"
                height="560"
                alt="Photo"
                className="object-cover rounded-2"
              />
            </Flex>
            <Flex className="w-full sm:w-[173] md:w-[234] h-[140] xs:h-[234]">
              <Image
                src="/products/photo.jpg"
                width="740"
                height="560"
                alt="Photo"
                className="object-cover rounded-2"
              />
            </Flex>
          </Flex>
        </Flex>

        <Flex direction="column" gap="7" className="w-full sm:w-1/2">
          <Flex direction="column" mt="5" gap="6">
            <Heading size="9" className="font-semibold">
              {t("title")}
            </Heading>

            <Text size="6" color="gray" className="leading-9">
              {t("description")}
            </Text>

            <Flex direction="column" gap="3">
              <Text
                weight="medium"
                size="3"
                className="flex items-center gap-1.5"
              >
                <ArrowsPointingOutIcon className="size-5" /> Obľúbené rozmery
              </Text>

              <Flex
                direction="row"
                align="center"
                gap="2"
                wrap="wrap"
                className="text-gray-11"
              >
                {sizes.slice(0, 4).map((size) => (
                  <Button key={size} variant="surface" size="2" color="blue">
                    {size} cm
                  </Button>
                ))}
                {showAll === true
                  ? sizes.slice(5).map((size) => (
                      <Button
                        key={size}
                        variant="surface"
                        size="2"
                        color="blue"
                      >
                        {size} cm
                      </Button>
                    ))
                  : undefined}
                |
                <Button variant="outline" size="2" color="blue">
                  Na mieru
                </Button>
              </Flex>

              <Button
                variant="ghost"
                size="2"
                color="gray"
                onClick={() => setShowAll(!showAll)}
                className="w-fit"
              >
                Zobraziť {showAll === true ? "menej" : "viac"}
              </Button>
            </Flex>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="between"
            gap="4"
            className="border-t border-gray-6 pt-4"
          >
            <Text size="7" weight="medium">
              Od 1,50 €
            </Text>

            <Button variant="solid" size="4" color="blue">
              Objednať teraz
            </Button>
          </Flex>

          <Grid columns={{ initial: "1", xs: "2", sm: "1" }} gap="4" mt="7">
            {features.map((feature) => (
              <Flex key={feature.name} direction="row" gap="2">
                <feature.icon color="magenta" className="size-5 mt-1" />
                <Flex direction="column">
                  <Text weight="medium" size="3">
                    {feature.name}
                  </Text>
                  <Text color="gray" size="2">
                    {feature.description}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </Grid>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap={{ initial: "2", xs: "4" }}
        className="mt-20"
      >
        <Text size="6" weight="medium">
          Ukážky prác
        </Text>

        <Grid
          columns={{ initial: "1", xs: "2", md: "3", lg: "4" }}
          gap="3"
          mt="2"
        >
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />

          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />

          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
          <Image
            src="/family.jpg"
            width="275"
            height="184"
            alt="Family"
            className="w-full object-cover rounded-2"
          />
        </Grid>
      </Flex>
    </Container>
  );
}

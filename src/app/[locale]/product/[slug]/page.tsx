import { Container, Flex, Grid, Heading, Text, Button } from "@radix-ui/themes";
import Image from "next/image";

import {
  ClockIcon,
  PencilIcon,
  PrinterIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import Sizes from "./sizes";
import { getLocale } from "next-intl/server";
import db from "@/db";
import { sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Locales } from "@/i18n/locales";
import Features from "./features";
import MoreProducts from "./more-products";

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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const locale = (await getLocale()) as Locales;

  const decodedSlug = decodeURIComponent(slug);

  const product = await db.query.products.findFirst({
    where: sql`slug->>'${sql.raw(locale)}' = ${decodedSlug} AND "status" = 'active'`,
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="w-full" mt={{ initial: "0", sm: "6", md: "8" }}>
      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="gap-10 sm:gap-14 md:gap-16 lg:gap-20"
      >
        <Flex direction="column" gap="3" className="sm:w-[24rem] md:w-[30rem]">
          <Flex className="w-full h-[20rem] xs:h-[30rem] sm:h-[36rem]">
            <Image
              src="/products/photo.jpg"
              width="740"
              height="560"
              alt="Photo"
              className="object-cover rounded-2"
            />
          </Flex>

          <Flex direction="row" gap="3">
            <Flex className="w-full h-36 xs:h-60">
              <Image
                src="/products/photo.jpg"
                width="740"
                height="560"
                alt="Photo"
                className="object-cover rounded-2"
              />
            </Flex>
            <Flex className="w-full h-36 xs:h-60">
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
          <Flex direction="column" mt={{ initial: "2", md: "5" }} gap="6">
            <Heading size="9" className="font-semibold">
              {product.name[locale]}
            </Heading>

            <Text size="6" color="gray" className="leading-9">
              {product.description[locale]}
            </Text>

            <Sizes />
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

          <Grid
            columns={{ initial: "1", xs: "2", sm: "1" }}
            gap="4"
            mt={{ initial: "7", md: "8" }}
          >
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
        direction={{ initial: "column", sm: "row" }}
        className="gap-10 sm:gap-14 md:gap-16 lg:gap-20 mt-24"
      >
        <Flex
          direction="column"
          justify="center"
          gap="6"
          className="w-full sm:w-1/2"
        >
          <Heading size="9" className="font-semibold">
            Feature 1
          </Heading>

          <Text size="5" color="gray" className="leading-8">
            {product.description[locale]}
          </Text>
        </Flex>

        <Flex className="w-full sm:w-[24rem] md:w-[30rem] h-[20rem] xs:h-[30rem] sm:h-[36rem]">
          <Image
            src="/products/photo.jpg"
            width="740"
            height="560"
            alt="Photo"
            className="object-cover rounded-2"
          />
        </Flex>
      </Flex>

      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="gap-10 sm:gap-14 md:gap-16 lg:gap-20 mt-24 sm:mt-12"
      >
        <Flex
          direction="column"
          justify="center"
          gap="6"
          className="w-full sm:w-1/2"
        >
          <Heading size="9" className="font-semibold">
            Feature 2
          </Heading>

          <Text size="5" color="gray" className="leading-8">
            {product.description[locale]}
          </Text>
        </Flex>

        <Flex className="w-full sm:w-[24rem] md:w-[30rem] h-[20rem] xs:h-[30rem] sm:h-[36rem] sm:order-first">
          <Image
            src="/products/photo.jpg"
            width="740"
            height="560"
            alt="Photo"
            className="object-cover rounded-2"
          />
        </Flex>
      </Flex>

      <Flex
        direction={{ initial: "column", sm: "row" }}
        className="gap-10 sm:gap-14 md:gap-16 lg:gap-20 mt-24 sm:mt-12"
      >
        <Flex
          direction="column"
          justify="center"
          gap="6"
          className="w-full sm:w-1/2"
        >
          <Heading size="9" className="font-semibold">
            Feature 3
          </Heading>

          <Text size="5" color="gray" className="leading-8">
            {product.description[locale]}
          </Text>
        </Flex>

        <Flex className="w-full w-full sm:w-[24rem] md:w-[30rem] h-[20rem] xs:h-[30rem] sm:h-[36rem]">
          <Image
            src="/products/photo.jpg"
            width="740"
            height="560"
            alt="Photo"
            className="object-cover rounded-2"
          />
        </Flex>
      </Flex>

      <Flex
        direction="column"
        gap={{ initial: "2", xs: "4" }}
        className="mt-24 sm:mt-10"
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

      <Features />

      <MoreProducts showHeading={true} columns="3" background={false} />
    </Container>
  );
}

"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { PlusIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VisuallyHidden,
  Container,
} from "@radix-ui/themes";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import RadioCardRenderer, { RadioCardConfiguration } from "./radio-card";
import TextAreaRenderer from "./textarea";
import SizeRenderer from "./size";
import BottomBar from "@/components/bottomBar";

export type BaseProductConfiguration = {
  id: string;
  name: Record<string, string>;
};

export type ProductConfiguration = RadioCardConfiguration;

const configuration = [
  {
    id: "process",
    type: "radio-card",
    name: {
      sk: "Spracovanie",
      en: "Process",
    },
    options: [
      {
        id: "standard",
        name: {
          sk: "Štandard",
          en: "Standard",
        },
        description: {
          sk: "Zakladne orezanie a spracovanie clovekom.",
          en: "Basic cropping and manual processing.",
        },
        price: 0,
      },
      {
        id: "premium",
        name: {
          sk: "Premium",
          en: "Premium",
        },
        description: {
          sk: "Orezanie, uprava kontrastu a farieb, odstranenie chyb.",
          en: "Cropping, contrast and color adjustment, defect removal.",
        },
        price: 2,
      },
    ],
  },
  {
    id: "frame",
    type: "radio-card",
    name: {
      sk: "Rám",
      en: "Frame",
    },
    options: [
      {
        id: "none",
        name: {
          sk: "Bez rámu",
          en: "No frame",
        },
        price: 0,
      },
      {
        id: "black",
        name: {
          sk: "Čierna lista",
          en: "Black",
        },
        price: 10,
      },
      {
        id: "white",
        name: {
          sk: "Biela lista",
          en: "White",
        },
        price: 10,
      },
      {
        id: "wood",
        name: {
          sk: "Drevena lista",
          en: "Wooden frame",
        },
        price: 20,
      },
    ],
  },
  {
    id: "note",
    type: "textarea",
    name: {
      sk: "Poznámka",
      en: "Note",
    },
  },
] as ProductConfiguration[];

const renderers = {
  "radio-card": RadioCardRenderer,
  size: SizeRenderer,
  textarea: TextAreaRenderer,
};

const OrderItem = () => {
  const t = useTranslations("OrderItem");
  const locale = useLocale();
  const format = useFormatter();

  const [price, setPrice] = useState(0);

  return (
    <Container className="w-full gap-4" mt="4">
      <Flex direction="row" justify="between" align="center">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="3" width="full" mt="4">
        <Heading as="h2" size="5">
          {t("files")}
        </Heading>

        <Grid
          columns={{
            initial: "2",
            xs: "3",
            sm: "4",
            md: "5",
            lg: "6",
            xl: "7",
          }}
          gap="3"
          width="full"
        >
          <Button className="bg-gray-2 rounded-3 h-[8rem] p-0">
            <VisuallyHidden>{t("add")}</VisuallyHidden>
            <PlusIcon className="size-10 text-gray-10" />
          </Button>
          <Button className="bg-gray-2 rounded-3 h-[8rem] relative text-left p-0 overflow-hidden">
            <Image
              src={`/family.jpg`}
              alt=""
              width={256}
              height={256}
              className="object-cover size-full"
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              py="1"
              px="2"
              className="bg-gray-surface text-gray-12 text-sm"
            >
              DSC020320.JPEG
            </Box>
          </Button>
        </Grid>
      </Flex>

      <Flex direction="column" gap="3" width="full" mt="4">
        <Heading as="h2" size="5">
          {t("configuration")}
        </Heading>

        <Flex direction="column" gap="4" width="full">
          {configuration.map((config) => (
            <Flex direction="column" gap="2" key={config.id}>
              <Heading as="h3" size="3">
                {config.name[locale]}
              </Heading>

              {renderers[config.type]({
                config,
                onChange: (option) => option?.price && setPrice(option.price),
              })}
            </Flex>
          ))}
        </Flex>
      </Flex>

      <BottomBar>
        <Text weight="medium">
          {t("total")}:{" "}
          <Text as="span" size="4" className="flex flex-col font-bold">
            {format.number(price, { style: "currency", currency: "EUR" })}
          </Text>
        </Text>

        <Flex direction="row" gap="2">
          <Button
            variant="solid"
            color="gray"
            size="3"
            className="bg-gray-4 text-gray-11"
          >
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            variant="solid"
            size="3"
            className="font-semibold"
          >
            {t("confirm")}
          </Button>
        </Flex>
      </BottomBar>
    </Container>
  );
};

export default OrderItem;

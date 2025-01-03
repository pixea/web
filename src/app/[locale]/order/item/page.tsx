"use client";

import { useState } from "react";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Heading, Text, Container } from "@radix-ui/themes";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { Link } from "@/i18n/routing";
import BottomBar from "@/components/bottomBar";

import RadioCardRenderer, { RadioCardConfiguration } from "./radio-card";
import TextAreaRenderer from "./textarea";

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

const Files = dynamic(() => import("./files"), {
  ssr: false,
});

const renderers = {
  "radio-card": RadioCardRenderer,
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

        <Files />
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

"use client";

import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import BottomBar from "@/components/bottomBar";
import { useFormatter, useTranslations } from "next-intl";
import { RadioCardConfiguration } from "./radio-card";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import { ShoppingCart } from "@/db/validation";
import useCart from "@/hooks/useCart/useCart";
import FilesSkeleton from "./files/skeleton";
import {
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import Configuration from "./configuration";
import { Product } from "@/db/schema";

export type BaseProductConfiguration = {
  id: string;
  name: Record<string, string>;
};

export type ProductConfiguration = RadioCardConfiguration;

const Files = dynamic(() => import("./files/files"), {
  ssr: false,
  loading: () => <FilesSkeleton />,
});

interface Props {
  session?: Session | null;
  initialCart: ShoppingCart;
  itemId: string;
  item?: NonNullable<ShoppingCart["items"]>[0];
  product: Product;
}

const Form = ({ session, initialCart, itemId, item, product }: Props) => {
  const t = useTranslations("OrderItem");
  const format = useFormatter();

  const { cart, addFileToCartItem, removeFileFromCartItem, isPending } =
    useCart(initialCart);

  const price = 0;

  return (
    <>
      <Flex direction={{ initial: "column", md: "row" }} gap="8">
        <Flex direction="column" gap="4" mt="5" className="w-full">
          <Flex direction="column">
            <Heading as="h2" size="5" className="flex items-center gap-2">
              <CloudArrowUpIcon className="size-6" /> {t("files")}
            </Heading>
          </Flex>

          <Files
            cartId={cart.id}
            itemId={itemId}
            files={item?.files}
            isAuthenticated={!!session?.user}
            addFileToCartItem={addFileToCartItem}
            removeFileFromCartItem={removeFileFromCartItem}
          />
        </Flex>

        <Flex direction="column" gap="4" mt="5" className="w-full md:w-2/3">
          <Heading as="h2" size="5" className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="size-6" />{" "}
            {t("configuration")}
          </Heading>

          <Configuration product={product} values={item?.configuration} />
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
            type="submit"
            variant="solid"
            size="3"
            className="font-semibold"
            disabled={isPending}
          >
            {t("continue")}
          </Button>
        </Flex>
      </BottomBar>
    </>
  );
};

export default Form;

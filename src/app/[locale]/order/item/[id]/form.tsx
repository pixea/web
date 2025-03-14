"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import BottomBar from "@/components/bottomBar";
import { useFormatter, useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Session } from "next-auth";
import { ShoppingCart } from "@/db/validation";
import useCart from "@/hooks/useCart/useCart";
import FilesSkeleton from "./files/skeleton";
import {
  AdjustmentsHorizontalIcon,
  CloudArrowUpIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import Configuration from "./configuration";
import { Product } from "@/db/schema";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useCallback, useState } from "react";
import { debounce } from "radash";

const Files = dynamic(() => import("./files/files"), {
  ssr: false,
  loading: () => <FilesSkeleton />,
});

interface Props {
  session?: Session | null;
  initialCart: ShoppingCart;
  itemId: string;
  product: Product;
}

const Form = ({ session, initialCart, itemId, product }: Props) => {
  const t = useTranslations("OrderItem");
  const format = useFormatter();

  const {
    cart,
    addFileToCartItem,
    removeFileFromCartItem,
    saveCartItemConfiguration,
    saveCartItemSize,
    savePieces,
    isPending,
  } = useCart(initialCart, { product });

  const item = cart?.items?.find((item) => item.id === itemId);

  const price = 0;

  const [quantity, setQuantity] = useState(item?.files?.pieces || 1);
  const debouncedSavePieces = useCallback(
    debounce({ delay: 1000 }, savePieces),
    []
  );
  const changeQuantity = (value: number) => {
    if (value === item?.files?.pieces) return;
    setQuantity(value);
    debouncedSavePieces(itemId, value);
  };

  const uploadedFilesCount = item?.files?.items.length || 0;

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

        <Flex direction="column" gap="9" mt="5" className="w-full md:w-2/3">
          <Flex direction="column" gap="4">
            <Heading as="h2" size="5" className="flex items-center gap-2">
              <RectangleStackIcon className="size-6" /> {t("quantity")}
            </Heading>

            <Flex direction="row" align="center" wrap="wrap" gap="3">
              <Box className="max-w-48">
                <TextField.Root
                  placeholder="0"
                  value={quantity}
                  onChange={(event) =>
                    changeQuantity(Number(event.target.value || 1))
                  }
                  type="number"
                  min="1"
                  minLength={1}
                  max="999"
                  maxLength={3}
                  size="3"
                  className="text-center w-[9.25rem]"
                >
                  <TextField.Slot pl="1">
                    <IconButton
                      color="gray"
                      size="2"
                      variant="soft"
                      onClick={() =>
                        quantity > 1 && changeQuantity(quantity - 1)
                      }
                    >
                      <MinusIcon height="16" width="16" />
                    </IconButton>
                  </TextField.Slot>

                  <TextField.Slot className="pl-0">
                    <Text color="gray" size="3">
                      {t("pieces", { value: quantity })}
                    </Text>
                  </TextField.Slot>

                  <TextField.Slot pl="0" pr="1">
                    <IconButton
                      color="gray"
                      size="2"
                      variant="soft"
                      onClick={() => changeQuantity(quantity + 1)}
                    >
                      <PlusIcon height="16" width="16" />
                    </IconButton>
                  </TextField.Slot>
                </TextField.Root>
              </Box>

              <Text color="gray" size="2">
                {t("quantityExplanation", {
                  count: uploadedFilesCount,
                })}{" "}
                <Text weight="medium">
                  (
                  {t("quantityExplanationTotal", {
                    total: uploadedFilesCount * quantity,
                  })}
                  )
                </Text>
              </Text>
            </Flex>
          </Flex>

          <Flex direction="column" gap="4">
            <Heading as="h2" size="5" className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="size-6" />{" "}
              {t("configuration")}
            </Heading>

            <Configuration
              product={product}
              values={item?.configuration}
              onChange={(change) => saveCartItemConfiguration(itemId, change)}
              size={item?.size}
              onSizeChange={(size) => saveCartItemSize(itemId, size)}
            />
          </Flex>
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

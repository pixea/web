"use client";

import { redirect } from "@/i18n/routing";
import { Button, Flex, Inset, Text } from "@radix-ui/themes";
import { useLocale } from "next-intl";
import Image from "next/image";

export interface Product {
  id: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  image: string;
}

const ProductPreview = ({ product }: { product: Product }) => {
  const locale = useLocale();

  return (
    <Button
      variant="outline"
      color="gray"
      className="relative h-auto flex-col text-left items-start p-0 gap-0 overflow-hidden"
      onClick={() => redirect({ href: "/order/item", locale })}
    >
      <Inset clip="padding-box" side="top" pb="current" className="h-48 w-full">
        <Image
          src={`/products/${product.image}`}
          alt=""
          width={300}
          height={100}
          className="object-cover size-full"
        />
      </Inset>

      <Flex direction="row" justify="between" p="4" gap="4" className="w-full">
        <Flex direction="column">
          <Text weight="bold" size="4" className="text-gray-12">
            {product.name[locale]}
          </Text>
          <Text size="2">{product.desc[locale]}</Text>
        </Flex>
      </Flex>
    </Button>
  );
};

export default ProductPreview;

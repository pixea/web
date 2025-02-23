"use client";

import { Product } from "@/db/schema";
import { Locales } from "@/i18n/locales";
import { useRouter } from "@/i18n/routing";
import { Button, Flex, Inset, Text } from "@radix-ui/themes";
import { useLocale } from "next-intl";
import Image from "next/image";

const ProductPreview = ({ product }: { product: Product }) => {
  const locale = useLocale();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      color="gray"
      className="relative h-auto flex-col text-left items-start p-0 gap-0 overflow-hidden"
      onClick={() =>
        router.push({
          pathname: `/order/item/[id]`,
          params: { id: crypto.randomUUID() },
          query: { productId: product.id },
        })
      }
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
            {product.name[locale as Locales]}
          </Text>
          <Text size="2">{product.description[locale as Locales]}</Text>
        </Flex>
      </Flex>
    </Button>
  );
};

export default ProductPreview;

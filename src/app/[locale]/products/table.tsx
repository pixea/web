import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Flex, Table } from "@radix-ui/themes";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { Product } from "@/db/schema";
import { Locales } from "@/i18n/locales";

const ProductsTable = ({ products }: { products: Product[] }) => {
  const t = useTranslations("Products");
  const format = useFormatter();
  const locale = useLocale() as Locales;

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row align="center">
          <Table.ColumnHeaderCell>{t("name")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("description")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("status")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("created")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("updated")}</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>{t("actions")}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {products.map((product) => (
          <Table.Row key={product.id} align="center">
            <Table.Cell>{product.name[locale]}</Table.Cell>
            <Table.Cell>{product.description[locale]}</Table.Cell>
            <Table.Cell>
              {product.status === "active" && (
                <Badge color="green">{t("active")}</Badge>
              )}
              {product.status === "draft" && (
                <Badge color="gray">{t("draft")}</Badge>
              )}
            </Table.Cell>
            <Table.Cell>
              {format.relativeTime(new Date(product.created))}
            </Table.Cell>
            <Table.Cell>
              {format.relativeTime(new Date(product.updated))}
            </Table.Cell>
            <Table.Cell>
              <Flex gap="2">
                <Button asChild>
                  {/* @ts-expect-error Dynamic route .. meh ... */}
                  <Link href={`/products/${1}`}>
                    <PencilIcon className="size-4" /> {t("edit")}
                  </Link>
                </Button>

                <Button color="red">
                  <TrashIcon className="size-3" /> {t("delete")}
                </Button>
              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default ProductsTable;

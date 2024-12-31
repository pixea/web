"use client";

import { useActionState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Flex, Table } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { DateTime } from "luxon";

import { Product } from "@/db/schema";
import { Locales } from "@/i18n/locales";
import { deleteProductAction } from "./actions";
import Toast, { ToastProvider } from "@/components/toast/toast";

const ProductsTable = ({ products }: { products: Product[] }) => {
  const t = useTranslations("Products");
  const locale = useLocale() as Locales;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteProductAction,
    { message: "" }
  );

  return (
    <>
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
                {DateTime.fromSQL(product.created, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                {DateTime.fromSQL(product.updated, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button asChild>
                    <Link href={`/${locale}/products/${product.id}`}>
                      <PencilIcon className="size-4" /> {t("edit")}
                    </Link>
                  </Button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={product.id} />

                    <Button type="submit" color="red" loading={deletePending}>
                      <TrashIcon className="size-3" /> {t("delete")}
                    </Button>
                  </form>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <ToastProvider>
        {deleteState.message && (
          <Toast title={t(deleteState.message)}>
            {t(`message.${deleteState.message}`)}
          </Toast>
        )}
      </ToastProvider>
    </>
  );
};

export default ProductsTable;

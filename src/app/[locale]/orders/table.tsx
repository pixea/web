"use client";

import { useActionState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Flex, Table } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { DateTime } from "luxon";

import { Order } from "@/db/schema";
import { Locales } from "@/i18n/locales";
import { ActionToasts } from "@/components/actionToasts";

import { deleteOrderAction } from "./actions";
import { ActionState } from "@/lib/utils";

const OrderTable = ({ orders }: { orders: Order[] }) => {
  const t = useTranslations("Orders");
  const locale = useLocale() as Locales;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteOrderAction,
    {} as ActionState
  );

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row align="center">
            <Table.ColumnHeaderCell>{t("name")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("company")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("email")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("role")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("created")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("updated")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("actions")}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id} align="center">
              {/* <Table.Cell>{order.name}</Table.Cell>
              <Table.Cell>{order.company}</Table.Cell> */}
              <Table.Cell>{order.email}</Table.Cell>
              <Table.Cell>
                {/* {order.role === "admin" && (
                  <Badge color="yellow">{t("admin")}</Badge>
                )}
                {order.role === "customer" && (
                  <Badge color="gray">{t("customer")}</Badge>
                )} */}
              </Table.Cell>
              <Table.Cell>
                {DateTime.fromSQL(order.created, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                {DateTime.fromSQL(order.updated, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button asChild>
                    <Link href={`/${locale}/orders/${order.id}`}>
                      <PencilIcon className="size-4" /> {t("edit")}
                    </Link>
                  </Button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={order.id} />

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

      <ActionToasts state={deleteState} />
    </>
  );
};

export default OrderTable;

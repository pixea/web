"use client";

import { useActionState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Card, Flex, Select, Table, Text, TextArea } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { DateTime } from "luxon";

import { Order } from "@/db/schema";
import { Locales } from "@/i18n/locales";
import { ActionToasts } from "@/components/actionToasts";
import { OrderStatusValue, orderStatusValues } from "@/lib/order-status";
import OrderStatusBadge from "@/components/order-status-badge";

import { deleteOrderAction, saveOrderAction, saveOrderSettingsAction } from "./actions";
import { ActionState } from "@/lib/utils";

type Props = {
  orders: Order[];
  mode: "admin" | "customer";
  adminNotificationEmails?: string[];
  notificationEmailCount?: number;
};

const OrderTable = ({
  orders,
  mode,
  adminNotificationEmails = [],
  notificationEmailCount = 0,
}: Props) => {
  const t = useTranslations("Orders");
  const locale = useLocale() as Locales;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteOrderAction,
    {} as ActionState,
  );
  const [saveState, saveAction, savePending] = useActionState(
    saveOrderAction,
    {} as ActionState,
  );
  const [settingsState, settingsAction, settingsPending] = useActionState(
    saveOrderSettingsAction,
    {} as ActionState,
  );

  const notificationEmailText = adminNotificationEmails.join("\n");

  return (
    <>
      {mode === "admin" ? (
        <Card size="2" variant="surface">
          <form action={settingsAction}>
            <Flex direction="column" gap="3">
              <Text size="4" weight="medium">
                {t("notifications.title")}
              </Text>
              <Text size="2" color="gray">
                {t("notifications.description")}
              </Text>
              <TextArea
                name="adminNotificationEmails"
                rows={4}
                placeholder={t("notifications.placeholder")}
                defaultValue={notificationEmailText}
              />
              <Text size="1" color="gray">
                {t("notifications.count", {
                  count: notificationEmailCount,
                })}
              </Text>
              <Flex justify="end">
                <Button type="submit" loading={settingsPending}>
                  {t("notifications.save")}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      ) : null}

      <Table.Root>
        <Table.Header>
          <Table.Row align="center">
            <Table.ColumnHeaderCell>{t("id")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("email")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("status")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("total")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("created")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("updated")}</Table.ColumnHeaderCell>
            {mode === "admin" ? (
              <Table.ColumnHeaderCell>{t("actions")}</Table.ColumnHeaderCell>
            ) : null}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {orders.map((order) => (
            <Table.Row key={order.id} align="center">
              <Table.Cell>#{order.id.slice(0, 8)}</Table.Cell>
              <Table.Cell>{order.email}</Table.Cell>
              <Table.Cell>
                <OrderStatusBadge status={order.status as OrderStatusValue} />
              </Table.Cell>
              <Table.Cell>
                {new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency: "EUR",
                }).format(
                  (order.sum?.cost || 0) + (order.sum?.delivery || 0) + (order.sum?.vat || 0),
                )}
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
              {mode === "admin" ? (
                <Table.Cell>
                  <Flex gap="2" align="center" wrap="wrap">
                    <form action={saveAction}>
                      <input type="hidden" name="id" value={order.id} />
                      <Flex gap="2" align="center">
                        <Select.Root
                          name="status"
                          defaultValue={order.status as OrderStatusValue}
                        >
                          <Select.Trigger className="min-w-40" />
                          <Select.Content>
                            {orderStatusValues.map((status) => (
                              <Select.Item key={status} value={status}>
                                {t(`statusValues.${status}`)}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                        <Button
                          type="submit"
                          loading={savePending}
                          disabled={savePending}
                        >
                          {t("updateStatus")}
                        </Button>
                      </Flex>
                    </form>

                    <Button asChild variant="soft">
                      <Link href={`/${locale}/orders/${order.id}`}>
                        <PencilIcon className="size-4" /> {t("edit")}
                      </Link>
                    </Button>

                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={order.id} />

                      <Button
                        type="submit"
                        color="red"
                        loading={deletePending}
                        disabled={deletePending}
                      >
                        <TrashIcon className="size-3" /> {t("delete")}
                      </Button>
                    </form>
                  </Flex>
                </Table.Cell>
              ) : null}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ActionToasts state={deleteState} />
      <ActionToasts state={saveState} />
      <ActionToasts state={settingsState} />
    </>
  );
};

export default OrderTable;

"use client";

import { Card, Flex, Grid, Table, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { DateTime } from "luxon";

import { Order } from "@/db/schema";
import { OrderStatusValue } from "@/lib/order-status";
import OrderStatusBadge from "@/components/order-status-badge";

const formatMoney = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(value || 0);

const OrderForm = ({ order, locale }: { order: Order; locale: string }) => {
  const t = useTranslations("Orders");

  return (
    <Flex direction="column" gap="4">
      <Card size="2">
        <Grid columns={{ initial: "1", sm: "2", md: "4" }} gap="4">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">
              {t("status")}
            </Text>
            <OrderStatusBadge status={order.status as OrderStatusValue} />
          </Flex>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">
              {t("created")}
            </Text>
            <Text>
              {DateTime.fromSQL(order.created, { zone: "UTC" }).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            </Text>
          </Flex>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">
              {t("updated")}
            </Text>
            <Text>
              {DateTime.fromSQL(order.updated, { zone: "UTC" }).toLocaleString(
                DateTime.DATETIME_MED,
              )}
            </Text>
          </Flex>
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">
              {t("total")}
            </Text>
            <Text weight="medium">
              {formatMoney(
                (order.sum?.cost || 0) +
                  (order.sum?.delivery || 0) +
                  (order.sum?.vat || 0),
                locale,
              )}
            </Text>
          </Flex>
        </Grid>
      </Card>

      <Card size="2">
        <Flex direction="column" gap="3">
          <Text size="4" weight="medium">
            {t("customerInfo")}
          </Text>
          <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">
                {t("email")}
              </Text>
              <Text>{order.email}</Text>
            </Flex>
            <Flex direction="column" gap="1">
              <Text size="1" color="gray">
                {t("phone")}
              </Text>
              <Text>{order.phone || "-"}</Text>
            </Flex>
          </Grid>
        </Flex>
      </Card>

      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        <Card size="2">
          <Flex direction="column" gap="3">
            <Text size="4" weight="medium">
              {t("deliveryAddress")}
            </Text>
            <Text>
              {order.deliveryAddress.street}
              {order.deliveryAddress.additional
                ? `, ${order.deliveryAddress.additional}`
                : ""}
            </Text>
            <Text>
              {order.deliveryAddress.zip} {order.deliveryAddress.city}
            </Text>
            <Text>{order.deliveryAddress.country.toUpperCase()}</Text>
          </Flex>
        </Card>

        <Card size="2">
          <Flex direction="column" gap="3">
            <Text size="4" weight="medium">
              {t("invoiceAddress")}
            </Text>
            {order.invoiceAddress.company ? (
              <Text>{order.invoiceAddress.company}</Text>
            ) : null}
            <Text>
              {order.invoiceAddress.street}
              {order.invoiceAddress.additional
                ? `, ${order.invoiceAddress.additional}`
                : ""}
            </Text>
            <Text>
              {order.invoiceAddress.zip} {order.invoiceAddress.city}
            </Text>
            <Text>{order.invoiceAddress.country.toUpperCase()}</Text>
            {order.invoiceAddress.companyId ? (
              <Text size="2" color="gray">
                {t("companyId")}: {order.invoiceAddress.companyId}
              </Text>
            ) : null}
            {order.invoiceAddress.taxId ? (
              <Text size="2" color="gray">
                {t("taxId")}: {order.invoiceAddress.taxId}
              </Text>
            ) : null}
            {order.invoiceAddress.vatId ? (
              <Text size="2" color="gray">
                {t("vatId")}: {order.invoiceAddress.vatId}
              </Text>
            ) : null}
          </Flex>
        </Card>
      </Grid>

      <Card size="2">
        <Flex direction="column" gap="3">
          <Text size="4" weight="medium">
            {t("items")}
          </Text>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t("itemProduct")}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t("itemFiles")}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t("itemSize")}</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>{t("itemPrice")}</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {order.items.map((item, index) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{item.productId}</Table.Cell>
                  <Table.Cell>{item.files?.items?.length || 0}</Table.Cell>
                  <Table.Cell>{item.size?.dimensions?.join(" × ") || "-"}</Table.Cell>
                  <Table.Cell>{formatMoney(item.price || 0, locale)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Card>
    </Flex>
  );
};

export default OrderForm;

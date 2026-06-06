"use client";

import { Badge, BadgeProps } from "@radix-ui/themes";
import { useTranslations } from "next-intl";

import { OrderStatusValue } from "@/lib/order-status";

const statusColor = (status: OrderStatusValue): BadgeProps["color"] => {
  if (status === "new") return "blue";
  if (status === "confirmed") return "cyan";
  if (status === "printed") return "orange";
  if (status === "packed") return "yellow";
  if (status === "shipped") return "indigo";
  if (status === "received") return "green";
  return "gray";
};

const OrderStatusBadge = ({ status }: { status: OrderStatusValue }) => {
  const t = useTranslations("Orders");

  return <Badge color={statusColor(status)}>{t(`statusValues.${status}`)}</Badge>;
};

export default OrderStatusBadge;

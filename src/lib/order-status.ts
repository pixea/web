export const orderStatusValues = [
  "new",
  "confirmed",
  "printed",
  "packed",
  "shipped",
  "received",
  "archived",
] as const;

export type OrderStatusValue = (typeof orderStatusValues)[number];

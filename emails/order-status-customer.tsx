import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { createTranslator } from "next-intl";
import * as React from "react";

import messages from "../messages";
import _tailwindConfig from "./_tailwind.config";
import { Locales } from "@/i18n/locales";

interface OrderStatusCustomerEmailProps {
  locale: Locales;
  orderId: string;
  statusLabel: string;
  orderUrl: string;
}

export const OrderStatusCustomerEmail = ({
  locale,
  orderId,
  statusLabel,
  orderUrl,
}: OrderStatusCustomerEmailProps) => {
  const intl = createTranslator({
    messages: messages[locale].OrderStatusCustomerEmail,
    locale,
  });

  return (
    <Tailwind config={_tailwindConfig}>
      <Html lang={locale} dir="ltr">
        <Head />
        <Preview>{intl("preview", { orderId, status: statusLabel })}</Preview>
        <Body style={main} className="mx-auto bg-white dark:bg-black">
          <Container className="mx-auto px-5 py-8">
            <Heading className="text-gray-900 dark:text-gray-50 font-semibold my-0 mb-6 p-0 text-3xl">
              {intl("title")}
            </Heading>

            <Text className="text-lg text-gray-700 dark:text-gray-200 mb-3">
              {intl("description", { orderId })}
            </Text>

            <Section className="bg-black/5 dark:bg-white/10 rounded-lg mb-8 px-5 py-5">
              <Text className="m-0 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {intl("statusLabel")}
              </Text>
              <Text className="m-0 mt-1 text-2xl text-black dark:text-white font-semibold">
                {statusLabel}
              </Text>
            </Section>

            <Text className="text-base text-gray-700 dark:text-gray-200 mb-8">
              <Link
                href={orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {intl("openOrders")}
              </Link>
            </Text>

            <Text className="text-xs text-gray-400 dark:text-gray-500 mb-0">
              &copy; 2026 Pixea
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

OrderStatusCustomerEmail.PreviewProps = {
  locale: "en",
  orderId: "ORD-12345",
  statusLabel: "Shipped",
  orderUrl: "https://pixea.sk/en/orders",
} as OrderStatusCustomerEmailProps;

export default OrderStatusCustomerEmail;

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

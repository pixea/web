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

type OrderNewAdminEmailProps = {
  locale: Locales;
  orderId: string;
  customerEmail: string;
  itemCount: number;
  subtotal: number;
  delivery: number;
  vat: number;
  total: number;
  preview: string;
  orderUrl: string;
};

const OrderNewAdminEmail = ({
  locale,
  orderId,
  customerEmail,
  itemCount,
  subtotal,
  delivery,
  vat,
  total,
  preview,
  orderUrl,
}: OrderNewAdminEmailProps) => {
  const intl = createTranslator({
    messages: messages[locale].OrderNewAdminEmail,
    locale,
  });

  return (
    <Tailwind config={_tailwindConfig}>
      <Html lang={locale} dir="ltr">
        <Head />
        <Preview>{preview}</Preview>
        <Body style={main} className="mx-auto bg-white dark:bg-black">
          <Container className="mx-auto px-5 py-8">
            <Section>
              <Heading className="text-gray-900 dark:text-gray-50 font-semibold mb-5 mt-0 text-3xl">
                {intl("title")}
              </Heading>

              <Text className="text-gray-800 dark:text-gray-200 text-base">
                {intl("description", {
                  orderId: orderId.slice(0, 8).toUpperCase(),
                })}
              </Text>

              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("customerEmail")}: <strong>{customerEmail}</strong>
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("itemCount")}: <strong>{itemCount}</strong>
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("subtotal")}: <strong>{subtotal.toFixed(2)} EUR</strong>
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("delivery")}: <strong>{delivery.toFixed(2)} EUR</strong>
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("vat")}: <strong>{vat.toFixed(2)} EUR</strong>
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 text-sm">
                {intl("total")}: <strong>{total.toFixed(2)} EUR</strong>
              </Text>

              <Link
                href={orderUrl}
                className="inline-block mt-3 rounded-md bg-blue-600 px-4 py-2 text-white no-underline"
              >
                {intl("openOrder")}
              </Link>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

OrderNewAdminEmail.PreviewProps = {
  locale: "en",
  orderId: "e6d4a9f2-2f8d-4b97-b3b6-2eaf9e7142e9",
  customerEmail: "customer@example.com",
  itemCount: 4,
  subtotal: 19.2,
  delivery: 3.9,
  vat: 4.62,
  total: 27.72,
  preview: "New order #E6D4A9F2 submitted.",
  orderUrl: "https://pixea.sk/en/orders/e6d4a9f2-2f8d-4b97-b3b6-2eaf9e7142e9",
} as OrderNewAdminEmailProps;

export default OrderNewAdminEmail;

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

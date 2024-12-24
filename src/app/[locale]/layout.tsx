import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "../globals.css";
import { Flex, Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";

import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import Header from "./header";
import Footer from "./footer";

const raleway = Raleway({
  variable: "--font-releway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: "sk" | "en" };
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${raleway.variable} antialiased`}>
        <ThemeProvider attribute="class">
          <Theme
            accentColor="blue"
            grayColor="gray"
            panelBackground="solid"
            scaling="110%"
            radius="large"
            className="flex flex-col"
          >
            <NextIntlClientProvider messages={messages}>
              <Header />

              <Flex direction="column" gap="4" m="4" className="flex-1" asChild>
                <main>{children}</main>
              </Flex>

              <Footer />
            </NextIntlClientProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
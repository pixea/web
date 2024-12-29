import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { createTranslator } from "next-intl";
import * as React from "react";
import messages from "../messages";
import _tailwindConfig from "./_tailwind.config";
import { Locales } from "@/i18n/locales";

interface VerificationEmailProps {
  code?: string;
  locale: Locales;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : "";

const baseUrl = "https://nova.pixea.sk";

export const VerificationEmail = ({ code, locale }: VerificationEmailProps) => {
  const intl = createTranslator({
    messages: messages[locale].VerificationEmail,
    locale,
  });

  const firstFour = code?.slice(0, 4);
  const lastFour = code?.slice(4);

  const slicedCode = firstFour + "-" + lastFour;

  return (
    <Tailwind config={_tailwindConfig}>
      <Html lang={locale} dir="ltr">
        <Head />
        <Preview>{intl("preview", { code: slicedCode })}</Preview>
        <Body style={main} className="mx-auto bg-white dark:bg-black">
          <Container className="mx-auto px-5">
            <Section className="mt-8">
              <Link href="https://pixea.sk" target="_blank">
                <Img
                  src={`${baseUrl}/brand/logo-light.png`}
                  width="120"
                  height="47"
                  alt="Pixea logo"
                  className="block dark:hidden"
                />
                <Img
                  src={`${baseUrl}/brand/logo-dark.png`}
                  width="120"
                  height="47"
                  alt="Pixea logo"
                  className="hidden dark:block"
                />
              </Link>
            </Section>

            <Heading className="text-gray-900 dark:text-gray-50 font-semibold my-8 p-0 text-4xl">
              {intl("title")}
            </Heading>

            <Text className="text-xl text-gray-700 dark:text-gray-200 mb-8">
              {intl("description")}
            </Text>

            <Section className="bg-black/5 dark:bg-white/10 rounded-lg mb-8 px-2.5 py-9 text-center">
              <Text className="font-mono text-black dark:text-white tracking-[7px] text-3xl align-middle">
                {slicedCode}
              </Text>
            </Section>

            <Text className="text-black text-gray-500 dark:text-gray-400 text-sm leading-6">
              {intl("warning")}
            </Text>

            <Section>
              <Row className="mb-8 px-2 w-full">
                <Column className="w-[66%]">
                  <Link href="https://pixea.sk" target="_blank">
                    <Img
                      src={`${baseUrl}/brand/logo-light.png`}
                      width="120"
                      height="47"
                      alt="Pixea logo"
                      className="block dark:hidden"
                    />
                    <Img
                      src={`${baseUrl}/brand/logo-dark.png`}
                      width="120"
                      height="47"
                      alt="Pixea logo"
                      className="hidden dark:block"
                    />
                  </Link>
                </Column>
                {/* <Column>
                  <Section>
                    <Row>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/static/slack-twitter.png`}
                            width="32"
                            height="32"
                            alt="Slack"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/static/slack-facebook.png`}
                            width="32"
                            height="32"
                            alt="Slack"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                      <Column>
                        <Link href="/">
                          <Img
                            src={`${baseUrl}/static/slack-linkedin.png`}
                            width="32"
                            height="32"
                            alt="Slack"
                            style={socialMediaIcon}
                          />
                        </Link>
                      </Column>
                    </Row>
                  </Section>
                </Column> */}
              </Row>
            </Section>

            <Section className="text-gray-400 dark:text-gray-500">
              <Link
                className="text-gray-400 dark:text-gray-500 underline"
                href="https://pixea.sk"
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl("links.home")}
              </Link>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <Link
                className="text-gray-400 dark:text-gray-500 underline"
                href="https://pixea.sk/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl("links.privacy")}
              </Link>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <Link
                className="text-gray-400 dark:text-gray-500 underline"
                href="https://pixea.sk/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl("links.terms")}
              </Link>
              &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
              <Link
                className="text-gray-400 dark:text-gray-500 underline"
                href="https://pixea.sk/contact"
                target="_blank"
                rel="noopener noreferrer"
                data-auth="NotApplicable"
                data-linkindex="6"
              >
                {intl("links.contact")}
              </Link>
              <Text className="text-xs text-gray-400 dark:text-gray-500 mb-10 text-left">
                &copy; 2025{" "}
                <Link
                  className="text-gray-400 dark:text-gray-500 underline"
                  href="https://dmedia.sk"
                  target="_blank"
                >
                  D.MEDIA, s.r.o.
                </Link>{" "}
                {intl("rights")}
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

VerificationEmail.PreviewProps = {
  code: "3FDXT2A8",
  locale: "en",
} as VerificationEmailProps;

export default VerificationEmail;

const main = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

// const socialMediaIcon = {
//   display: "inline",
//   marginLeft: "32px",
// };

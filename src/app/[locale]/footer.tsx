import { Link } from "@/i18n/routing";
import {
  Flex,
  Text,
  Link as RadixLink,
  Container,
  Separator,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="1"
      mx="2"
      mt="8"
      className="pt-20 pb-10 border-t border-gray-6"
      asChild
    >
      <footer>
        <Container className="w-full px-2.5">
          <Flex
            direction={{ initial: "column", md: "row" }}
            justify="between"
            align={{ initial: "center", sm: "start" }}
            gap="8"
            className="text-center sm:text-left"
          >
            <Flex direction="column" gap="2" mb="4">
              <Link href="/" title={t("home")}>
                <Image
                  src="/brand/icon-light.svg"
                  alt=""
                  width={102}
                  height={40}
                  className="block dark:hidden"
                />
                <Image
                  src="/brand/icon-dark.svg"
                  alt=""
                  width={102}
                  height={40}
                  className="hidden dark:block"
                />
              </Link>

              {/* <Text color="gray" size="4" weight="medium">
                {t("motto")}
              </Text> */}
            </Flex>

            <Flex
              direction="column"
              align={{ initial: "center", sm: "start" }}
              className="gap-12"
            >
              <Flex
                direction={{ initial: "column", sm: "row" }}
                align={{ initial: "center", sm: "start" }}
                className="gap-12 sm:gap-36"
              >
                <Flex
                  direction="column"
                  align={{ initial: "center", sm: "start" }}
                  gap="1"
                >
                  <Text weight="medium" size="3" mb="1">
                    {t("products")}
                  </Text>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">Tlač fotografíí</Link>
                  </RadixLink>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">Fotopanely</Link>
                  </RadixLink>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">Fotoplátna</Link>
                  </RadixLink>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">Iné</Link>
                  </RadixLink>
                </Flex>

                <Flex
                  direction="column"
                  align={{ initial: "center", sm: "start" }}
                  gap="1"
                >
                  <Text weight="medium" size="3" mb="1">
                    {t("shopping.title")}
                  </Text>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">
                      {t("shopping.delivery")}
                    </Link>
                  </RadixLink>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">{t("terms")}</Link>
                  </RadixLink>

                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">
                      {t("shopping.help")}
                    </Link>
                  </RadixLink>
                  <RadixLink color="gray" size="3" asChild>
                    <Link href="/product/photo-print">
                      {t("shopping.account")}
                    </Link>
                  </RadixLink>
                </Flex>

                <Flex
                  direction="column"
                  align={{ initial: "center", sm: "start" }}
                  gap="1"
                >
                  <Text weight="medium" size="3" mb="1">
                    {t("contact.title")}
                  </Text>

                  <RadixLink href="mailto:info@pixea.sk" color="gray" size="3">
                    info@pixea.sk
                  </RadixLink>
                  <RadixLink href="tel:+421944758139" color="gray" size="3">
                    +421 999 999 999
                  </RadixLink>

                  <Text color="gray" size="2" mt="3" className="max-w-52">
                    {t("contact.description")}
                  </Text>
                </Flex>
              </Flex>

              <Flex direction="column" gap="2">
                <Text weight="medium" size="3" mb="1">
                  {t("partners")}
                </Text>

                <Flex
                  direction={{ initial: "column", sm: "row" }}
                  align="center"
                  gap="7"
                >
                  {/* Packeta */}
                  <Image
                    src="/other/delivery/packeta.svg"
                    width="102"
                    height="40"
                    alt="Packeta logo"
                  />

                  <Separator
                    orientation={{ initial: "horizontal", sm: "vertical" }}
                    size={{ initial: "3", sm: "2" }}
                  />

                  {/* DPD */}
                  <Flex direction="row" gap="5">
                    <Image
                      src="/other/delivery/dpd_light.svg"
                      width="80"
                      height="40"
                      alt="DPD logo"
                      className="dark:hidden"
                    />

                    <Image
                      src="/other/delivery/dpd_dark.svg"
                      width="80"
                      height="40"
                      alt="DPD logo"
                      className="hidden dark:block"
                    />

                    <Image
                      src="/other/delivery/dpd-pickup.svg"
                      width="40"
                      height="40"
                      alt="DPD Pickup logo"
                    />
                  </Flex>

                  <Separator
                    orientation={{ initial: "horizontal", sm: "vertical" }}
                    size={{ initial: "3", sm: "2" }}
                  />

                  {/* SPS */}
                  <Flex direction="row" gap="5">
                    <Image
                      src="/other/delivery/sps_light.svg"
                      width="80"
                      height="40"
                      alt="SPS logo"
                      className="dark:hidden"
                    />

                    <Image
                      src="/other/delivery/sps_dark.svg"
                      width="80"
                      height="40"
                      alt="SPS logo"
                      className="hidden dark:block"
                    />

                    <Image
                      src="/other/delivery/balikovo.svg"
                      width="40"
                      height="40"
                      alt="SPS balikovo logo"
                    />
                  </Flex>
                </Flex>
              </Flex>

              <Flex
                direction={{ initial: "column", sm: "row" }}
                align="center"
                justify="between"
                gap={{ initial: "6", sm: "8" }}
                className="w-full mt-8 md:mt-24 lg:mt-36"
              >
                <Text color="gray" size="1">
                  &copy; 2025{" "}
                  <RadixLink
                    href="https://dmedia.sk/"
                    target="_blank"
                    color="gray"
                  >
                    D.MEDIA, s.r.o.
                  </RadixLink>{" "}
                  {t("rights")}
                </Text>

                <Flex
                  direction={{ initial: "column", xs: "row" }}
                  align="center"
                  gap="4"
                >
                  <RadixLink href="#" color="gray" size="1">
                    {t("privacy")}
                  </RadixLink>
                  <RadixLink href="#" color="gray" size="1">
                    {t("terms")}
                  </RadixLink>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </footer>
    </Flex>
  );
};

export default Footer;

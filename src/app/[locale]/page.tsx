import { Link } from "@/i18n/routing";
import {
  Flex,
  Heading,
  Button,
  Container,
  Box,
  Text,
  Grid,
  Separator,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  BoltIcon,
  HandThumbUpIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  UserGroupIcon,
  CheckBadgeIcon,
  ArchiveBoxXMarkIcon,
  ClockIcon,
  LockClosedIcon,
  ArrowRightIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import MoreProducts from "./product/[slug]/more-products";

export default function Home() {
  const t = useTranslations("Home");
  const highlightItems = [
    {
      title: "highlights.items.fast.title",
      description: "highlights.items.fast.description",
      icon: BoltIcon,
    },
    {
      title: "highlights.items.intuitive.title",
      description: "highlights.items.intuitive.description",
      icon: SparklesIcon,
    },
    {
      title: "highlights.items.delivery.title",
      description: "highlights.items.delivery.description",
      icon: TruckIcon,
    },
    {
      title: "highlights.items.quality.title",
      description: "highlights.items.quality.description",
      icon: CheckBadgeIcon,
    },
  ] as const;

  const privacyItems = [
    {
      title: "privacy.items.uploads.title",
      description: "privacy.items.uploads.description",
      icon: ArchiveBoxXMarkIcon,
    },
    {
      title: "privacy.items.previews.title",
      description: "privacy.items.previews.description",
      icon: ClockIcon,
    },
    {
      title: "privacy.items.gdpr.title",
      description: "privacy.items.gdpr.description",
      icon: ShieldCheckIcon,
    },
    {
      title: "privacy.items.protection.title",
      description: "privacy.items.protection.description",
      icon: LockClosedIcon,
    },
  ] as const;

  return (
    <>
      <Container>
        <Flex
          direction="column"
          gap="6"
          align="center"
          justify="center"
          className="mt-16 md:mt-28 mb-6"
        >
          <Heading
            align="center"
            className="font-semibold text-5xl xs:text-7xl md:text-8xl"
          >
            {t("title")}
          </Heading>

          <Button variant="solid" size="4">
            <Link href="/order">{t("button1")}</Link>
          </Button>
        </Flex>
      </Container>

      <MoreProducts showHeading={false} columns="4" background={true} />

      <Container className="mt-16 mb-20">
        <Flex direction="column" gap="9">
          <Box className="rounded-2xl border border-blue-6/35 bg-gradient-to-br from-blue-3/45 via-indigo-3/25 to-transparent p-6 md:p-8 shadow-sm">
            <Flex direction="column" gap="5">
              <Flex direction={{ initial: "column", sm: "row" }} gap="2">
                {/* <Box className="rounded-lg bg-blue-9/10 p-2">
                  <HandThumbUpIcon className="size-8 text-blue-11" />
                </Box> */}
                <Heading as="h2" size="8">{t("highlights.title")}</Heading>
              </Flex>
              <Text size="3" color="gray">
                {t("highlights.description")}
              </Text>
              <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                {highlightItems.map((item) => (
                  <Box
                    key={item.title}
                    className="rounded-xl border border-gray-6 bg-color-panel p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Flex direction="column" gap="3">
                      <Box className="mt-0.5 rounded-lg bg-blue-9/10 p-2">
                        <item.icon className="size-6 text-blue-11" />
                      </Box>
                      <Flex direction="column" gap="1">
                        <Heading as="h3" weight="medium">{t(item.title)}</Heading>
                        <Text size="2" color="gray" mt="1">
                          {t(item.description)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Flex>
          </Box>

          <Box className="rounded-2xl border border-indigo-6/35 bg-gradient-to-br from-indigo-3/40 via-blue-2/20 to-transparent p-6 md:p-8 shadow-sm">
            <Flex direction="column" gap="5">
              <Flex align="center" gap="2">
                <Box className="rounded-lg bg-indigo-9/10 p-2">
                  <TruckIcon className="size-8 text-indigo-11" />
                </Box>
                <Heading as="h2" size="8">{t("delivery.title")}</Heading>
              </Flex>
              <Text size="3" color="gray">
                {t("delivery.description")}
              </Text>

              <Flex
                direction={{ initial: "column", sm: "row" }}
                align="center"
                gap={{ initial: "5", sm: "6" }}
                wrap="wrap"
              >
                <Image
                  src="/other/delivery/packeta.svg"
                  width={102}
                  height={40}
                  alt={t("delivery.logos.packeta")}
                  className="transition-opacity hover:opacity-75"
                />

                <Separator
                  orientation={{ initial: "horizontal", sm: "vertical" }}
                  size={{ initial: "3", sm: "2" }}
                />

                <Flex direction="row" align="center" gap="4">
                  <Image
                    src="/other/delivery/dpd_light.svg"
                    width={80}
                    height={40}
                    alt={t("delivery.logos.dpd")}
                    className="dark:hidden transition-opacity hover:opacity-75"
                  />
                  <Image
                    src="/other/delivery/dpd_dark.svg"
                    width={80}
                    height={40}
                    alt={t("delivery.logos.dpd")}
                    className="hidden dark:block transition-opacity hover:opacity-75"
                  />
                  <Image
                    src="/other/delivery/dpd-pickup.svg"
                    width={40}
                    height={40}
                    alt={t("delivery.logos.dpdPickup")}
                    className="transition-opacity hover:opacity-75"
                  />
                </Flex>

                <Separator
                  orientation={{ initial: "horizontal", sm: "vertical" }}
                  size={{ initial: "3", sm: "2" }}
                />

                <Flex direction="row" align="center" gap="4">
                  <Image
                    src="/other/delivery/sps_light.svg"
                    width={86}
                    height={40}
                    alt={t("delivery.logos.sps")}
                    className="dark:hidden transition-opacity hover:opacity-75"
                  />
                  <Image
                    src="/other/delivery/sps_dark.svg"
                    width={86}
                    height={40}
                    alt={t("delivery.logos.sps")}
                    className="hidden dark:block transition-opacity hover:opacity-75"
                  />
                  <Image
                    src="/other/delivery/balikovo.svg"
                    width={40}
                    height={40}
                    alt={t("delivery.logos.balikovo")}
                    className="transition-opacity hover:opacity-75"
                  />
                </Flex>
              </Flex>

              <Box className="rounded-xl border border-indigo-6/25 bg-indigo-3/20 p-4">
                <Flex align="start" gap="3">
                  <Box className="rounded-lg bg-indigo-9/10 p-2">
                    <BuildingStorefrontIcon className="size-6 text-indigo-11" />
                  </Box>
                  <Text size="2" color="gray">
                    {t("delivery.branchPrefix")}{" "}
                    <Text as="span" weight="medium" color="gray">
                      Dom Služieb - Dukelská 57/64, 087 01 Giraltovce, Slovensko
                    </Text>
                    .
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Box>

          <Box className="rounded-2xl border border-emerald-6/35 bg-gradient-to-br from-emerald-3/30 via-green-3/20 to-transparent p-6 md:p-8 shadow-sm">
            <Flex direction="column" gap="5">
              <Flex align="center" gap="2">
                <Box className="rounded-lg bg-emerald-9/10 p-2">
                  <ShieldCheckIcon className="size-8 text-emerald-11" />
                </Box>
                <Heading as="h2" size="8">{t("privacy.title")}</Heading>
              </Flex>
              <Text size="3" color="gray">
                {t("privacy.description")}
              </Text>
              <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                {privacyItems.map((item) => (
                  <Box
                    key={item.title}
                    className="rounded-xl border border-gray-6 bg-color-panel p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <Flex align="start" gap="3">
                      <Box className="mt-0.5 rounded-lg bg-emerald-9/10 p-2">
                        <item.icon className="size-6 text-emerald-11" />
                      </Box>
                      <Flex direction="column" gap="1">
                        <Heading as="h3" weight="medium">{t(item.title)}</Heading>
                        <Text size="2" color="gray" mt="1">
                          {t(item.description)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Flex>
          </Box>

          <Box className="rounded-2xl border border-blue-6/35 bg-gradient-to-r from-blue-4/45 via-indigo-3/30 to-blue-3/25 p-6 md:p-8 shadow-sm">
            <Flex direction="column" align="center" gap="3" className="text-center">
              <Box className="rounded-full bg-blue-9/15 p-3">
                <UserGroupIcon className="size-8 text-blue-11" />
              </Box>
              <Heading size="6">{t("cta.title")}</Heading>
              <Text size="3" color="gray">
                {t("cta.description")}
              </Text>
              <Button size="3" mt="2" className="shadow-sm">
                <Link href="/order" className="inline-flex items-center gap-2">
                  {t("cta.button")}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

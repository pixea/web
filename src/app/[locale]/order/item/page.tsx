import { Link } from "@/i18n/routing";
import { PlusIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const OrderItem = () => {
  const t = useTranslations("OrderItem");
  const locale = useLocale();

  return (
    <Flex direction="column" gap="4" mt="4">
      <Flex direction="row" justify="between" align="center">
        <Heading size="7">{t("title")}</Heading>

        <Button asChild color="gray" variant="ghost">
          <Link href="/order" className="flex items-center">
            <ArrowUturnLeftIcon className="size-4" />
            {t("back")}
          </Link>
        </Button>
      </Flex>

      <Flex direction="column" gap="3" width="full" mt="4">
        <Heading as="h2" size="5">
          {t("files")}
        </Heading>

        <Grid
          columns={{
            initial: "2",
            xs: "3",
            sm: "4",
            md: "5",
            lg: "6",
            xl: "7",
          }}
          gap="3"
          width="full"
        >
          <Button className="bg-gray-2 rounded-3 h-[8rem] p-0">
            <VisuallyHidden>{t("add")}</VisuallyHidden>
            <PlusIcon className="size-10 text-gray-10" />
          </Button>
          <Button className="bg-gray-2 rounded-3 h-[8rem] relative text-left p-0 overflow-hidden">
            <Image
              src={`/products/canvas.jpg`}
              alt=""
              width={256}
              height={256}
              className="object-cover size-full"
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              py="1"
              px="2"
              className="bg-gray-surface text-gray-12 text-sm"
            >
              DSC020320.JPEG
            </Box>
          </Button>
        </Grid>
      </Flex>

      <Flex direction="column" gap="3" width="full" mt="4">
        <Heading as="h2" size="5">
          {t("configuration")}
        </Heading>
      </Flex>
    </Flex>
  );
};

export default OrderItem;

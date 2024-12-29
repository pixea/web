import { Link } from "@/i18n/routing";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button, Container, Flex, Heading, Table } from "@radix-ui/themes";
import { useFormatter, useTranslations } from "next-intl";

const ProductsPage = () => {
  const t = useTranslations("Products");
  const format = useFormatter();

  return (
    <Container className="w-full" mt="4">
      <Flex direction="column" gap="4" mt="4">
        <Flex
          direction="row"
          justify="between"
          align="center"
          gap="4"
          wrap="wrap"
        >
          <Heading size="7">{t("title")}</Heading>

          <Button asChild color="blue" variant="solid" size="2">
            <Link href="/products/new" className="flex items-center gap-1.5">
              <PlusIcon className="size-4" />
              {t("add")}
            </Link>
          </Button>
        </Flex>

        <Table.Root>
          <Table.Header>
            <Table.Row align="center">
              <Table.ColumnHeaderCell>{t("name")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>
                {t("description")}
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("created")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("updated")}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t("actions")}</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row align="center">
              <Table.RowHeaderCell>Photo</Table.RowHeaderCell>
              <Table.Cell>Description</Table.Cell>
              <Table.Cell>{format.relativeTime(new Date())}</Table.Cell>
              <Table.Cell>{format.relativeTime(new Date())}</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button asChild>
                    {/* @ts-expect-error Dynamic route .. meh ... */}
                    <Link href={`/products/${1}`}>
                      <PencilIcon className="size-4" /> {t("edit")}
                    </Link>
                  </Button>

                  <Button color="red">
                    <TrashIcon className="size-3" /> {t("delete")}
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Flex>
    </Container>
  );
};

export default ProductsPage;

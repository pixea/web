"use client";

import { useActionState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Badge, Button, Flex, Table } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { DateTime } from "luxon";

import { User } from "@/db/schema";
import { Locales } from "@/i18n/locales";
import { ActionToasts } from "@/components/actionToasts";

import { deleteUserAction } from "./actions";
import { ActionState } from "@/lib/utils";

const UsersTable = ({ users }: { users: User[] }) => {
  const t = useTranslations("Users");
  const locale = useLocale() as Locales;

  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteUserAction,
    {} as ActionState
  );

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row align="center">
            <Table.ColumnHeaderCell>{t("name")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("company")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("email")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("role")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("created")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("updated")}</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>{t("actions")}</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user.id} align="center">
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.company}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                {user.role === "admin" && (
                  <Badge color="yellow">{t("admin")}</Badge>
                )}
                {user.role === "customer" && (
                  <Badge color="gray">{t("customer")}</Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {DateTime.fromSQL(user.created, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                {DateTime.fromSQL(user.updated, {
                  zone: "UTC",
                }).toRelative()}
              </Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <Button asChild>
                    <Link href={`/${locale}/users/${user.id}`}>
                      <PencilIcon className="size-4" /> {t("edit")}
                    </Link>
                  </Button>

                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={user.id} />

                    <Button type="submit" color="red" loading={deletePending}>
                      <TrashIcon className="size-3" /> {t("delete")}
                    </Button>
                  </form>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ActionToasts state={deleteState} />
    </>
  );
};

export default UsersTable;

"use client";

import {
  Button,
  Text,
  TextField,
  Tabs,
  Box,
  Flex,
  Select,
  Grid,
  Callout,
  Separator,
  Switch,
} from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { saveAccountAction } from "./actions";
import {
  ArrowLeftEndOnRectangleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { logoutAction } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";

const countries = [
  "at",
  "be",
  "bg",
  "hr",
  "cy",
  "dk",
  "ee",
  "fi",
  "fr",
  "de",
  "gr",
  "hu",
  "ie",
  "im",
  "it",
  "lv",
  "lt",
  "lu",
  "mt",
  "mc",
  "nl",
  "pl",
  "pt",
  "ro",
  "si",
  "es",
  "se",
];

const Account = ({ session }: { session: Session }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const t = useTranslations("Auth");

  // Get current tab or default to "account"
  const tab = searchParams.get("tab") || "account";

  // Change tab and update the URL
  const handleTab = (tab: string) => {
    const newUrl = `/auth/?tab=${tab}`;
    router.push(newUrl);
  };

  // Get `name` from session
  const name = session.user?.name;

  // Autofocus "Name" field on new account
  const nameFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!name && nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  }, [name]);

  // Get other user's data from session
  const email = session.user?.email;

  const company = session.user?.company;
  const companyId = session.user?.companyId;
  const taxId = session.user?.taxId;
  const vatId = session.user?.vatId;

  const phone = session.user?.phone;
  const address = session.user?.address;

  const role = session.user?.role;

  // "Fill in company info" switch handling
  const hasAnyCompanyDetails = Boolean(company || companyId || taxId || vatId);
  const [companyChecked, setCompanyChecked] = useState(hasAnyCompanyDetails);

  const countryOptions = countries
    .map((code) => ({ code, label: t(`address.country.${code}`) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Tabs.Root value={tab} onValueChange={handleTab}>
        {/* TAB NAVIGATION */}
        <Tabs.List>
          <Tabs.Trigger value="orders">
            <Text size="3" className="flex items-center gap-1.5">
              <ShoppingBagIcon className="size-4" /> {t("orders.tab")}
            </Text>
          </Tabs.Trigger>
          <Tabs.Trigger value="account">
            <Text size="3" className="flex items-center gap-1.5">
              <UserIcon className="size-4" /> {t("account")}
            </Text>
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          {/* ORDERS */}
          <Tabs.Content value="orders">
            {/* ADMIN WARNING */}
            {role === "admin" ? (
              <Callout.Root
                size="2"
                variant="surface"
                color="orange"
                role="alert"
              >
                <Callout.Icon>
                  <ExclamationTriangleIcon className="size-4" />
                </Callout.Icon>
                <Callout.Text>
                  <Text weight="bold">{t("orders.adminWarning.bold")}</Text>{" "}
                  {t("orders.adminWarning.desc")}{" "}
                  <Link href="/orders" className="underline">
                    {t("orders.adminWarning.link")}
                  </Link>
                </Callout.Text>
              </Callout.Root>
            ) : undefined}
          </Tabs.Content>

          {/* ACCOUNT */}
          <Tabs.Content value="account" mt="3">
            <form action={saveAccountAction}>
              <Flex direction="column" gap="6">
                {/* BASIC */}
                <Flex direction="column" gap="4">
                  <Text size="3" weight="medium">
                    {t("basic")}
                  </Text>

                  {/* NAME */}
                  <Grid columns="1" className="sm:grid-cols-2 sm:gap-4">
                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color={!name ? "orange" : "gray"}
                        weight="medium"
                        as="label"
                        htmlFor="name"
                      >
                        {t("name")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color={!name ? "orange" : "gray"}
                        radius="large"
                        required
                        ref={nameFieldRef}
                        placeholder={t("enterName")}
                        defaultValue={name || undefined}
                        type="text"
                        id="name"
                        name="name"
                      />

                      <Text
                        size="2"
                        color="orange"
                        weight="medium"
                        className={`flex items-center gap-1.5 ${!name ? "block" : "hidden"}`}
                        role="alert"
                      >
                        <ExclamationTriangleIcon className="size-4" /> Prosím
                        vyplňte svoje meno, aby sme vás vedeli ľahko
                        identifikovať.
                      </Text>
                    </Flex>
                  </Grid>

                  {/* COMPANY */}
                  <Grid columns="1" className="sm:grid-cols-2 sm:gap-4">
                    <Text
                      color={!companyChecked ? "gray" : undefined}
                      as="label"
                      size="3"
                    >
                      <Flex gap="2">
                        <Switch
                          variant="soft"
                          size="2"
                          color="blue"
                          checked={companyChecked}
                          onCheckedChange={setCompanyChecked}
                        />{" "}
                        {t("company.switch")}
                      </Flex>
                    </Text>
                  </Grid>

                  {companyChecked ? (
                    <Grid columns="1" className="sm:grid-cols-2 sm:gap-4">
                      {/* COMPANY NAME */}
                      <Flex direction="column" gap="2" className="w-full">
                        <Text
                          size="1"
                          color="gray"
                          weight="medium"
                          as="label"
                          htmlFor="company"
                        >
                          {t("company.name")}
                        </Text>
                        <TextField.Root
                          size="3"
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={t("company.name")}
                          defaultValue={company || undefined}
                          type="text"
                          name="company"
                          id="company"
                        />
                      </Flex>

                      {/* COMPANY ID */}
                      <Flex direction="column" gap="2" className="w-full">
                        <Text
                          size="1"
                          color="gray"
                          weight="medium"
                          as="label"
                          htmlFor="companyId"
                        >
                          {t("company.id")}
                        </Text>
                        <TextField.Root
                          size="3"
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={t("company.id")}
                          defaultValue={companyId || undefined}
                          type="text"
                          name="companyId"
                          id="companyId"
                        />
                      </Flex>

                      {/* TAX ID */}
                      <Flex direction="column" gap="2" className="w-full">
                        <Text
                          size="1"
                          color="gray"
                          weight="medium"
                          as="label"
                          htmlFor="taxId"
                        >
                          {t("company.taxId")}
                        </Text>
                        <TextField.Root
                          size="3"
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={t("company.taxId")}
                          defaultValue={taxId || undefined}
                          type="text"
                          name="taxId"
                          id="taxId"
                        />
                      </Flex>

                      {/* VAT ID */}
                      <Flex direction="column" gap="2" className="w-full">
                        <Text
                          size="1"
                          color="gray"
                          weight="medium"
                          as="label"
                          htmlFor="vatId"
                        >
                          {t("company.vatId")}
                        </Text>
                        <TextField.Root
                          size="3"
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={t("company.vatId")}
                          defaultValue={vatId || undefined}
                          type="text"
                          name="vatId"
                          id="vatId"
                        />
                      </Flex>
                    </Grid>
                  ) : undefined}
                </Flex>

                {/* CONTACT */}
                <Flex direction="column" gap="4">
                  <Text size="3" weight="medium">
                    {t("contact")}
                  </Text>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    {/* PHONE */}
                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="phone"
                      >
                        {t("phone")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color="gray"
                        radius="large"
                        placeholder={t("enterPhone")}
                        defaultValue={phone || undefined}
                        type="text"
                        id="phone"
                        name="phone"
                      >
                        <TextField.Slot side="left" color="gray" pr="2">
                          <PhoneIcon className="size-4" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Flex>

                    {/* EMAIL */}
                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="email"
                      >
                        {t("email")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="soft"
                        color="gray"
                        radius="large"
                        disabled
                        placeholder={t("enterEmail")}
                        defaultValue={email || undefined}
                        type="email"
                        id="email"
                        name="email"
                      >
                        <TextField.Slot side="left" color="gray" pr="2">
                          <EnvelopeIcon className="size-4" />
                        </TextField.Slot>
                      </TextField.Root>
                    </Flex>
                  </Grid>
                </Flex>

                {/* ADDRESS */}
                <Flex direction="column" gap="4">
                  <Text size="3" weight="medium">
                    {t("address.title")}
                  </Text>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="street"
                      >
                        {t("address.street")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color="gray"
                        radius="large"
                        placeholder={t("address.street")}
                        defaultValue={address?.street || undefined}
                        type="text"
                        name="street"
                        id="street"
                      />
                    </Flex>

                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="additional"
                      >
                        {t("address.additional")} ({t("optional")})
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color="gray"
                        radius="large"
                        placeholder={t("address.enterAdditional")}
                        defaultValue={address?.additional || undefined}
                        type="text"
                        name="additional"
                        id="additional"
                      />
                    </Flex>
                  </Grid>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2" className="w-full">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="zip"
                      >
                        {t("address.zip")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color="gray"
                        radius="large"
                        placeholder={t("address.zip")}
                        defaultValue={address?.zip || undefined}
                        type="text"
                        name="zip"
                        id="zip"
                      />
                    </Flex>

                    <Flex direction="column" gap="2" className="w-full">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="city"
                      >
                        {t("address.city")}
                      </Text>
                      <TextField.Root
                        size="3"
                        variant="surface"
                        color="gray"
                        radius="large"
                        placeholder={t("address.city")}
                        defaultValue={address?.city || undefined}
                        type="text"
                        name="city"
                        id="city"
                      />
                    </Flex>
                  </Grid>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2">
                      <Text
                        size="1"
                        color="gray"
                        weight="medium"
                        as="label"
                        htmlFor="country"
                      >
                        {t("address.country.title")}
                      </Text>

                      <Select.Root
                        size="3"
                        defaultValue={address?.country || undefined}
                        name="country"
                      >
                        <Select.Trigger
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={t("address.selectCountry")}
                        />
                        <Select.Content>
                          <Select.Group>
                            <Select.Item value={"none"}>
                              {t("address.country.none")}
                            </Select.Item>

                            <Select.Separator />

                            <Select.Item value="sk">
                              {t("address.country.sk")}
                            </Select.Item>

                            <Select.Item value="cz">
                              {t("address.country.cz")}
                            </Select.Item>

                            <Select.Separator />

                            {countryOptions.map(({ code, label }) => (
                              <Select.Item key={code} value={label}>
                                {label}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                  </Grid>
                </Flex>
              </Flex>

              <Flex position="sticky" bottom="2" mt="6">
                <Button
                  size="3"
                  type="submit"
                  variant="solid"
                  className="w-full"
                >
                  {t("save")}
                </Button>
              </Flex>
            </form>

            <Separator orientation="horizontal" className="w-full mt-4" />

            <form action={logoutAction}>
              <Button
                size="3"
                type="submit"
                variant="soft"
                color="red"
                className="w-full mt-4 gap-1.5"
              >
                <ArrowLeftEndOnRectangleIcon className="size-4" /> {t("logout")}
              </Button>
            </form>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
};

export default Account;

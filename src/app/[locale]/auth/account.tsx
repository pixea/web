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
} from "@radix-ui/themes";
import { Session } from "next-auth";
import { useTranslations } from "next-intl";
import { saveAccount } from "./actions";
import {
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

import { useLocale } from "next-intl";

const Account = ({ session }: { session: Session }) => {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const name = session.user?.name;

  // Autofocus "Name" field on new account
  const autofocustRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!name && autofocustRef.current) {
      autofocustRef.current.focus();
    }
  }, [name]); // Reacts to changes in shouldFocus

  const email = session.user?.email;
  const phone = session.user?.phone;
  const address = session.user?.address;

  const countries = {
    en: [
      "sk",
      "cz",
      "SEPARATOR",
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
    ],

    sk: [
      "sk",
      "cz",
      "SEPARATOR",
      "be",
      "bg",
      "cy",
      "dk",
      "ee",
      "fi",
      "fr",
      "gr",
      "nl",
      "hr",
      "ie",
      "lt",
      "lv",
      "lu",
      "hu",
      "mt",
      "mc",
      "de",
      "im",
      "pl",
      "pt",
      "at",
      "ro",
      "si",
      "es",
      "se",
      "it",
    ],
  };

  return (
    <>
      <Tabs.Root defaultValue="account">
        <Tabs.List className="">
          <Tabs.Trigger value="orders">
            <Text size="3">Objednávky</Text>
          </Tabs.Trigger>
          <Tabs.Trigger value="account">
            <Text size="3">Môj účet</Text>
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="orders">
            <Text size="2">
              Edit your profile or update contact information.
            </Text>
          </Tabs.Content>

          <Tabs.Content value="account" mt="2">
            <form action={saveAccount}>
              <Flex direction="column" gap="6">
                {/* <Callout.Root variant="surface" color="orange" role="alert">
                  <Callout.Icon>
                    <ExclamationTriangleIcon className="size-4" />
                  </Callout.Icon>
                  <Callout.Text>
                    Prosím vyplňte svoje meno, aby sme vás vedeli ľahko
                    identifikovať.
                  </Callout.Text>
                </Callout.Root> */}

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
                      ref={autofocustRef}
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
                        {t("address.additional")} ({t("optional").toLowerCase()}
                        )
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

                            {locale === "en"
                              ? countries.en.map((country, index) =>
                                  country === "SEPARATOR" ? (
                                    <Select.Separator key={country + index} />
                                  ) : (
                                    <Select.Item
                                      key={country}
                                      value={t(`address.country.${country}`)}
                                    >
                                      {t(`address.country.${country}`)}
                                    </Select.Item>
                                  )
                                )
                              : countries.sk.map((country, index) =>
                                  country === "SEPARATOR" ? (
                                    <Select.Separator key={country + index} />
                                  ) : (
                                    <Select.Item
                                      key={country}
                                      value={t(`address.country.${country}`)}
                                    >
                                      {t(`address.country.${country}`)}
                                    </Select.Item>
                                  )
                                )}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                  </Grid>
                </Flex>
              </Flex>

              <Flex position="sticky" bottom="2" mt="8">
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

            {/* <form action={logout}>
              <Button
                size="3"
                type="submit"
                variant="solid"
                color="red"
                className="w-full mt-4 gap-1.5"
              >
                <ArrowLeftEndOnRectangleIcon className="size-4" /> {t("logout")}
              </Button>
            </form> */}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
};

export default Account;

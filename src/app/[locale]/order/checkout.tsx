"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  RadioCards,
  Select,
  Separator,
  Switch,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Session } from "next-auth";
import { useFormatter, useTranslations } from "next-intl";

import { Product } from "@/db/schema";
import { ShoppingCart } from "@/db/validation";
import { calculateItemPrice } from "@/utils/pricing";
import { ActionState } from "@/lib/utils";
import { ActionToasts } from "@/components/actionToasts";
import BottomBar from "@/components/bottomBar";
import useAuthUrl from "@/hooks/useAuthUrl";
import { Link } from "@/i18n/routing";

import { submitOrderAction } from "./actions";

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
  "sk",
  "cz",
];

const roundMoney = (value: number) => Number(value.toFixed(2));

type Props = {
  cart: ShoppingCart;
  products: Product[];
  session?: Session | null;
  isPending: boolean;
  resetCart: () => void;
};

const Checkout = ({ cart, products, session, isPending, resetCart }: Props) => {
  const t = useTranslations("Order");
  const tAuth = useTranslations("Auth");
  const format = useFormatter();
  const authUrl = useAuthUrl();

  const [actionState, submitAction, submitPending] = useActionState(
    submitOrderAction,
    { message: "" } as ActionState,
  );

  useEffect(() => {
    if (actionState.result === "success") {
      resetCart();
    }
  }, [actionState.result, resetCart]);

  const user = session?.user;
  const hasAnyCompanyDetails = Boolean(
    user?.company || user?.companyId || user?.taxId || user?.vatId,
  );

  const [deliveryType, setDeliveryType] = useState<"courier" | "pickup">(
    "courier",
  );
  const [invoiceSameAsDelivery, setInvoiceSameAsDelivery] = useState(true);
  const [companyChecked, setCompanyChecked] = useState(hasAnyCompanyDetails);

  const countryOptions = countries
    .map((code) => ({ code, label: tAuth(`address.country.${code}`) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const pricedItems = useMemo(() => {
    return (cart.items || []).map((item) => {
      const product = products.find((candidate) => candidate.id === item.productId);
      const computedPrice = product ? calculateItemPrice(product, item) : 0;
      return {
        id: item.id,
        price: roundMoney(item.price ?? computedPrice),
      };
    });
  }, [cart.items, products]);

  const subtotal = roundMoney(
    pricedItems.reduce((sum, item) => sum + item.price, 0),
  );
  const deliveryCost = deliveryType === "pickup" ? 0 : 3.9;
  const vat = roundMoney((subtotal + deliveryCost) * 0.2);
  const total = roundMoney(subtotal + deliveryCost + vat);

  const canSubmit = !!session?.user && !!cart.items?.length && !isPending;

  return (
    <form action={submitAction} className="w-full">
      <input type="hidden" name="invoiceSameAsDelivery" value={invoiceSameAsDelivery ? "on" : ""} />
      <Flex direction="column" gap="5" mb="2" className="w-full">
        <Card size="2">
          <Flex direction="column" gap="4">
            <Text size="5" weight="bold">
              {t("checkout")}
            </Text>

            {!session?.user ? (
              <Flex direction="column" gap="3">
                <Text color="gray">{t("loginRequired")}</Text>
                <Button asChild>
                  <Link href={authUrl}>{t("loginToContinue")}</Link>
                </Button>
              </Flex>
            ) : null}

            {!cart.items?.length ? (
              <Text color="gray">{t("checkoutEmpty")}</Text>
            ) : null}

            {session?.user && cart.items?.length ? (
              <>
                <Separator size="4" />

                <Flex direction="column" gap="3">
                  <Text size="4" weight="medium">
                    {t("deliveryMethod")}
                  </Text>
                  <RadioCards.Root
                    name="deliveryType"
                    columns={{ initial: "1", sm: "2" }}
                    value={deliveryType}
                    onValueChange={(value) =>
                      setDeliveryType(value === "pickup" ? "pickup" : "courier")
                    }
                  >
                    <RadioCards.Item value="courier">
                      <Flex direction="column">
                        <Text weight="medium">{t("delivery.courier")}</Text>
                        <Text size="1" color="gray">
                          {format.number(3.9, { style: "currency", currency: "EUR" })}
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="pickup">
                      <Flex direction="column">
                        <Text weight="medium">{t("delivery.pickup")}</Text>
                        <Text size="1" color="gray">
                          {format.number(0, { style: "currency", currency: "EUR" })}
                        </Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Flex>

                <Separator size="4" />

                <Flex direction="column" gap="4">
                  <Text size="4" weight="medium">
                    {t("deliveryDetails")}
                  </Text>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2">
                      <Text size="1" color="gray" weight="medium" as="label" htmlFor="phone">
                        {tAuth("phone")}
                      </Text>
                      <TextField.Root
                        id="phone"
                        name="phone"
                        type="text"
                        size="3"
                        variant="surface"
                        radius="large"
                        placeholder={tAuth("enterPhone")}
                        defaultValue={user.phone || undefined}
                      />
                    </Flex>
                  </Grid>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2">
                      <Text size="1" color="gray" weight="medium" as="label" htmlFor="street">
                        {tAuth("address.street")}
                      </Text>
                      <TextField.Root
                        id="street"
                        name="street"
                        required
                        type="text"
                        size="3"
                        variant="surface"
                        radius="large"
                        placeholder={tAuth("address.street")}
                        defaultValue={user.address?.street || undefined}
                      />
                    </Flex>
                    <Flex direction="column" gap="2">
                      <Text size="1" color="gray" weight="medium" as="label" htmlFor="additional">
                        {tAuth("address.additional")} ({tAuth("optional")})
                      </Text>
                      <TextField.Root
                        id="additional"
                        name="additional"
                        type="text"
                        size="3"
                        variant="surface"
                        radius="large"
                        placeholder={tAuth("address.enterAdditional")}
                        defaultValue={user.address?.additional || undefined}
                      />
                    </Flex>
                  </Grid>

                  <Grid columns="1" gap="4" className="sm:grid-cols-2">
                    <Flex direction="column" gap="2">
                      <Text size="1" color="gray" weight="medium" as="label" htmlFor="zip">
                        {tAuth("address.zip")}
                      </Text>
                      <TextField.Root
                        id="zip"
                        name="zip"
                        required
                        type="text"
                        size="3"
                        variant="surface"
                        radius="large"
                        placeholder={tAuth("address.zip")}
                        defaultValue={user.address?.zip || undefined}
                      />
                    </Flex>
                    <Flex direction="column" gap="2">
                      <Text size="1" color="gray" weight="medium" as="label" htmlFor="city">
                        {tAuth("address.city")}
                      </Text>
                      <TextField.Root
                        id="city"
                        name="city"
                        required
                        type="text"
                        size="3"
                        variant="surface"
                        radius="large"
                        placeholder={tAuth("address.city")}
                        defaultValue={user.address?.city || undefined}
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
                        htmlFor="country-trigger"
                      >
                        {tAuth("address.country.title")}
                      </Text>
                      <Select.Root
                        name="country"
                        defaultValue={user.address?.country || "sk"}
                      >
                        <Select.Trigger
                          id="country-trigger"
                          variant="surface"
                          color="gray"
                          radius="large"
                          placeholder={tAuth("address.selectCountry")}
                        />
                        <Select.Content>
                          <Select.Group>
                            {countryOptions.map(({ code, label }) => (
                              <Select.Item key={code} value={code}>
                                {label}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                  </Grid>
                </Flex>

                <Separator size="4" />

                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between" wrap="wrap" gap="2">
                    <Text size="4" weight="medium">
                      {t("invoiceDetails")}
                    </Text>
                    <Text as="label" size="2" color={!invoiceSameAsDelivery ? "gray" : undefined}>
                      <Flex align="center" gap="2">
                        <Switch
                          checked={invoiceSameAsDelivery}
                          onCheckedChange={setInvoiceSameAsDelivery}
                        />
                        {t("invoiceSameAsDelivery")}
                      </Flex>
                    </Text>
                  </Flex>

                  <Text as="label" size="3" color={!companyChecked ? "gray" : undefined}>
                    <Flex align="center" gap="2">
                      <Switch checked={companyChecked} onCheckedChange={setCompanyChecked} />
                      {tAuth("company.switch")}
                    </Flex>
                  </Text>

                  {companyChecked ? (
                    <Grid columns="1" gap="4" className="sm:grid-cols-2">
                      <Flex direction="column" gap="2" className="w-full">
                        <Text size="1" color="gray" weight="medium" as="label" htmlFor="company">
                          {tAuth("company.name")}
                        </Text>
                        <TextField.Root
                          id="company"
                          name={invoiceSameAsDelivery ? "company" : "invoiceCompany"}
                          type="text"
                          size="3"
                          variant="surface"
                          radius="large"
                          placeholder={tAuth("company.name")}
                          defaultValue={user.company || undefined}
                        />
                      </Flex>
                      <Flex direction="column" gap="2" className="w-full">
                        <Text size="1" color="gray" weight="medium" as="label" htmlFor="companyId">
                          {tAuth("company.id")}
                        </Text>
                        <TextField.Root
                          id="companyId"
                          name={invoiceSameAsDelivery ? "companyId" : "invoiceCompanyId"}
                          type="text"
                          size="3"
                          variant="surface"
                          radius="large"
                          placeholder={tAuth("company.id")}
                          defaultValue={user.companyId || undefined}
                        />
                      </Flex>
                      <Flex direction="column" gap="2" className="w-full">
                        <Text size="1" color="gray" weight="medium" as="label" htmlFor="taxId">
                          {tAuth("company.taxId")}
                        </Text>
                        <TextField.Root
                          id="taxId"
                          name={invoiceSameAsDelivery ? "taxId" : "invoiceTaxId"}
                          type="text"
                          size="3"
                          variant="surface"
                          radius="large"
                          placeholder={tAuth("company.taxId")}
                          defaultValue={user.taxId || undefined}
                        />
                      </Flex>
                      <Flex direction="column" gap="2" className="w-full">
                        <Text size="1" color="gray" weight="medium" as="label" htmlFor="vatId">
                          {tAuth("company.vatId")}
                        </Text>
                        <TextField.Root
                          id="vatId"
                          name={invoiceSameAsDelivery ? "vatId" : "invoiceVatId"}
                          type="text"
                          size="3"
                          variant="surface"
                          radius="large"
                          placeholder={tAuth("company.vatId")}
                          defaultValue={user.vatId || undefined}
                        />
                      </Flex>
                    </Grid>
                  ) : null}

                  {!invoiceSameAsDelivery ? (
                    <>
                      <Grid columns="1" gap="4" className="sm:grid-cols-2">
                        <Flex direction="column" gap="2">
                          <Text
                            size="1"
                            color="gray"
                            weight="medium"
                            as="label"
                            htmlFor="invoiceStreet"
                          >
                            {tAuth("address.street")}
                          </Text>
                          <TextField.Root
                            id="invoiceStreet"
                            name="invoiceStreet"
                            required
                            type="text"
                            size="3"
                            variant="surface"
                            radius="large"
                            placeholder={tAuth("address.street")}
                            defaultValue={user.address?.street || undefined}
                          />
                        </Flex>
                        <Flex direction="column" gap="2">
                          <Text
                            size="1"
                            color="gray"
                            weight="medium"
                            as="label"
                            htmlFor="invoiceAdditional"
                          >
                            {tAuth("address.additional")} ({tAuth("optional")})
                          </Text>
                          <TextField.Root
                            id="invoiceAdditional"
                            name="invoiceAdditional"
                            type="text"
                            size="3"
                            variant="surface"
                            radius="large"
                            placeholder={tAuth("address.enterAdditional")}
                            defaultValue={user.address?.additional || undefined}
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
                            htmlFor="invoiceZip"
                          >
                            {tAuth("address.zip")}
                          </Text>
                          <TextField.Root
                            id="invoiceZip"
                            name="invoiceZip"
                            required
                            type="text"
                            size="3"
                            variant="surface"
                            radius="large"
                            placeholder={tAuth("address.zip")}
                            defaultValue={user.address?.zip || undefined}
                          />
                        </Flex>
                        <Flex direction="column" gap="2">
                          <Text
                            size="1"
                            color="gray"
                            weight="medium"
                            as="label"
                            htmlFor="invoiceCity"
                          >
                            {tAuth("address.city")}
                          </Text>
                          <TextField.Root
                            id="invoiceCity"
                            name="invoiceCity"
                            required
                            type="text"
                            size="3"
                            variant="surface"
                            radius="large"
                            placeholder={tAuth("address.city")}
                            defaultValue={user.address?.city || undefined}
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
                            htmlFor="invoiceCountry-trigger"
                          >
                            {tAuth("address.country.title")}
                          </Text>
                          <Select.Root
                            name="invoiceCountry"
                            defaultValue={user.address?.country || "sk"}
                          >
                            <Select.Trigger
                              id="invoiceCountry-trigger"
                              variant="surface"
                              color="gray"
                              radius="large"
                              placeholder={tAuth("address.selectCountry")}
                            />
                            <Select.Content>
                              <Select.Group>
                                {countryOptions.map(({ code, label }) => (
                                  <Select.Item key={code} value={code}>
                                    {label}
                                  </Select.Item>
                                ))}
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </Flex>
                      </Grid>
                    </>
                  ) : null}
                </Flex>

                <Separator size="4" />
              </>
            ) : null}

            <Flex direction="column" gap="2">
              <Text size="4" weight="medium">
                {t("summary")}
              </Text>
              <Flex justify="between">
                <Text color="gray">{t("summaryItems", { count: pricedItems.length })}</Text>
                <Text>{format.number(subtotal, { style: "currency", currency: "EUR" })}</Text>
              </Flex>
              <Flex justify="between">
                <Text color="gray">{t("summaryDelivery")}</Text>
                <Text>
                  {format.number(deliveryCost, { style: "currency", currency: "EUR" })}
                </Text>
              </Flex>
              <Flex justify="between">
                <Text color="gray">{t("summaryVat")}</Text>
                <Text>{format.number(vat, { style: "currency", currency: "EUR" })}</Text>
              </Flex>
              <Separator size="4" />
              <Flex justify="between" align="center">
                <Text weight="bold">{t("summaryTotal")}</Text>
                <Text size="5" weight="bold">
                  {format.number(total, { style: "currency", currency: "EUR" })}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>

        <BottomBar>
          <Box>
            <Text size="2" color="gray">
              {t("summaryTotal")}
            </Text>
            <Text size="5" weight="bold">
              {format.number(total, { style: "currency", currency: "EUR" })}
            </Text>
          </Box>
          <Button type="submit" size="3" loading={submitPending} disabled={!canSubmit}>
            {t("submitOrder")}
          </Button>
        </BottomBar>
      </Flex>

      <ActionToasts state={actionState} />
    </form>
  );
};

export default Checkout;

"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Callout } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const ErrorAlert = () => {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("error");

  if (!errorCode) return null;

  return (
    <Callout.Root variant="surface" color="red" role="alert">
      <Callout.Icon>
        <ExclamationCircleIcon className="size-4" />
      </Callout.Icon>
      <Callout.Text>{t(`error.${errorCode}`)}</Callout.Text>
    </Callout.Root>
  );
};

export default ErrorAlert;

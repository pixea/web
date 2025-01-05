"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Progress,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import Uppy, { Meta } from "@uppy/core";
import { useUppyState, useUppyEvent } from "@uppy/react";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import { Session } from "next-auth";
import type { Locale as UppyLocale } from "@uppy/utils/lib/Translator";

import { MAX_FILE_SIZE, MAX_UNAUTHENTICATED_FILE_SIZE } from "@/utils/file";

import Slovak from "@uppy/locales/lib/sk_SK";
import { Locales } from "@/i18n/locales";
import { s3PluginOptions } from "./s3";
import { RestrictionError } from "@uppy/core/lib/Restricter";

const uppyLocales: Record<Locales, UppyLocale | undefined> = {
  en: undefined,
  sk: Slovak,
};

const SUPPORTED_FILE_TYPES = [
  "image/*",

  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".tif",
  ".tiff",
  ".psd",
  ".pdf",
  ".svg",
  ".eps",
  ".cdr",
];

const Files = ({ id, session }: { id: string; session: Session }) => {
  const t = useTranslations("Order");
  const locale = useLocale() as Locales;

  const [uppy] = useState(() =>
    new Uppy<Meta, AwsBody>({
      id,
      autoProceed: true,
      restrictions: {
        maxFileSize: session.user
          ? MAX_FILE_SIZE
          : MAX_UNAUTHENTICATED_FILE_SIZE,
        allowedFileTypes: SUPPORTED_FILE_TYPES,
      },
      locale: uppyLocales[locale],
    }).use(AwsS3, s3PluginOptions)
  );

  const files = useUppyState(uppy, (state) => state.files);
  const state = useUppyState(uppy, (state) => state);

  console.log("state", state);

  // const [results, clearResults] = useUppyEvent(uppy, '');

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.length) return;

    const files = Array.from(event.target.files);

    files.forEach((file) => {
      try {
        uppy.addFile({
          source: "file input",
          name: file.name,
          type: file.type,
          data: file,
        });
      } catch (err) {
        if (
          (err as RestrictionError<Meta, Record<string, unknown>>).isRestriction
        ) {
          // TODO: handle restrictions
          console.log("Restriction error:", err);
        } else {
          // TODO: handle other errors
          console.error(err);
        }
      }
    });

    event.target.value = "";
  };

  return (
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
      <Text
        as="label"
        className="flex justify-center items-center bg-gray-3 rounded-3 h-[8rem] p-0 cursor-pointer hover:bg-gray-6"
      >
        <PlusIcon className="size-10 text-gray-10" />
        <VisuallyHidden>{t("add")}</VisuallyHidden>
        <input
          type="file"
          multiple
          accept={SUPPORTED_FILE_TYPES.join(",")}
          onChange={onFileInputChange}
          className="hidden"
        />
      </Text>

      {Object.values(files).map((file) => (
        <Box
          key={file.id}
          className="bg-gray-2 rounded-3 h-[8rem] relative text-left p-0 overflow-hidden"
        >
          <Button
            title={file.progress?.uploadComplete ? "Open" : "Uploading..."}
            disabled={!file.progress?.uploadComplete}
            className="relative size-full text-accent-contrast"
          >
            {/* <img
            src={URL.createObjectURL(file.data)}
            alt=""
            width={256}
            height={256}
            className="object-cover size-full"
          /> */}
            <Progress
              value={file.progress?.percentage || 0}
              variant="soft"
              radius="none"
              className="absolute top-0 left-0 size-full"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              className="transform -translate-x-1/2 -translate-y-1/2 text-lg"
            >
              {file.progress?.percentage || 0} %
            </Box>
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              py="1"
              px="2"
              className="bg-gray-surface text-gray-12 text-sm"
            >
              {file.name}
            </Box>
          </Button>

          {/* <IconButton
            color="gray"
            variant="ghost"
            className="absolute top-0 right-0 p-2 bg-gray-a4 rounded-tl-none rounded-br-none hover:bg-red-4"
            onClick={() => uppy.removeFile(file.id)}
          >
            <XMarkIcon className="size-5" />
          </IconButton> */}
          <IconButton
            color="gray"
            variant="ghost"
            className="absolute top-0 right-0 p-2 bg-gray-a4 rounded-tl-none rounded-br-none hover:bg-red-8 m-0"
            title="Remove"
            onClick={() => uppy.removeFile(file.id)}
          >
            <XMarkIcon className="size-5" />
          </IconButton>
        </Box>
      ))}
    </Grid>
  );
};

export default Files;

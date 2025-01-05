"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Grid,
  IconButton,
  Progress,
  Text,
  VisuallyHidden,
  Tooltip,
} from "@radix-ui/themes";
import Uppy, { Meta } from "@uppy/core";
import { useUppyState, useUppyEvent } from "@uppy/react";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";
import type { Locale as UppyLocale } from "@uppy/utils/lib/Translator";

import {
  MAX_FILE_SIZE,
  MAX_UNAUTHENTICATED_FILE_SIZE,
  SUPPORTED_FILE_TYPES,
  UppyMetadata,
} from "@/utils/file";

import Slovak from "@uppy/locales/lib/sk_SK";
import { Locales } from "@/i18n/locales";
import { s3PluginOptions } from "./s3";
import { RestrictionError } from "@uppy/core/lib/Restricter";
import { OrderItemFilePayload, ShoppingCartItem } from "@/db/validation";
import combineFiles from "./combineFiles";
import Image from "next/image";

const uppyLocales: Record<Locales, UppyLocale | undefined> = {
  en: undefined,
  sk: Slovak,
};

interface Props {
  cartId: string;
  itemId: string;
  files?: ShoppingCartItem["files"];
  isAuthenticated: boolean;
  addFileToCartItem: (cartItemId: string, file: OrderItemFilePayload) => void;
}

const Files = ({
  cartId,
  itemId,
  files,
  isAuthenticated,
  addFileToCartItem,
}: Props) => {
  const t = useTranslations("Order");
  const locale = useLocale() as Locales;

  const [uppy] = useState(() =>
    new Uppy<UppyMetadata, AwsBody>({
      id: itemId,
      autoProceed: true,
      restrictions: {
        maxFileSize: isAuthenticated
          ? MAX_FILE_SIZE
          : MAX_UNAUTHENTICATED_FILE_SIZE,
        allowedFileTypes: SUPPORTED_FILE_TYPES,
      },
      locale: uppyLocales[locale],
    }).use(AwsS3, s3PluginOptions)
  );

  const uploadingFiles = useUppyState(uppy, (state) => state.files);

  useUppyEvent(uppy, "upload-success", async (file, response) => {
    console.log("Upload success", { file, response });
    // TODO: Add error handling
    if (!file) return;

    const s3Key = new URL(response.uploadURL!).pathname.replace(
      "/original/",
      ""
    );

    // TODO: Add error handling
    addFileToCartItem(itemId, {
      id: file?.meta.fileId as string,
      name: file.name!,
      size: file.size!,
      s3Key,
      pieces: files?.pieces || 1,
      hasThumbnail: false,
    });
  });

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
          meta: { cartId, itemId, fileId: crypto.randomUUID() },
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

  const combinedFiles = combineFiles(
    Object.values(uploadingFiles),
    files?.items
  );

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

      {combinedFiles.map((file) => {
        const fileName = file.name || "";
        const lastDotIndex = fileName.lastIndexOf(".");
        const name =
          lastDotIndex === -1 ? fileName : fileName.substring(0, lastDotIndex);
        const extension =
          lastDotIndex === -1 ? "" : fileName.substring(lastDotIndex);

        return (
          <Box
            key={file.id}
            className="bg-gray-2 rounded-3 h-[8rem] relative text-left p-0 overflow-hidden"
          >
            <Tooltip content={file.name}>
              <Button
                title={"uppyFile" in file ? t("uploading") : t("open")}
                disabled={"uppyFile" in file}
                className="relative size-full text-accent-contrast"
              >
                {"hasThumbnail" in file && file.hasThumbnail && (
                  <Image
                    unoptimized
                    src={file.s3Key}
                    alt={file.name}
                    width={256}
                    height={256}
                    className="object-cover size-full"
                  />
                )}
                {"uppyFile" in file && (
                  <>
                    <Progress
                      value={file.uppyFile.progress?.percentage || 0}
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
                      {file.uppyFile.progress?.percentage || 0} %
                    </Box>
                  </>
                )}
                <Flex
                  position="absolute"
                  align="center"
                  bottom="0"
                  left="0"
                  right="0"
                  py="1"
                  px="2"
                  className="bg-gray-surface text-gray-12 text-sm"
                >
                  <Text className="truncate">{name}</Text>
                  <Text>{extension}</Text>
                </Flex>
              </Button>
            </Tooltip>

            <Tooltip content={t("removeFile")}>
              <IconButton
                color="gray"
                variant="ghost"
                className="absolute top-0 right-0 p-2 bg-gray-a4 rounded-tl-none rounded-br-none hover:bg-red-8 m-0"
                // TODO: Add removing of uploaded files
                onClick={() =>
                  "uppyFile" in file ? uppy.removeFile(file.id) : () => {}
                }
              >
                <XMarkIcon className="size-5" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      })}
    </Grid>
  );
};

export default Files;

"use client";

import { useCallback, useState } from "react";
import { Flex, Grid, Text, VisuallyHidden } from "@radix-ui/themes";
import Uppy, { Meta } from "@uppy/core";
import { useUppyState, useUppyEvent } from "@uppy/react";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
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
import FileItem from "./fileItem";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

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

  const [uppy] = useState<Uppy<UppyMetadata, AwsBody>>(() =>
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
    // TODO: Add error handling
    if (!file) return;

    const s3KeyOriginal =
      (response.body?.key as string) ||
      decodeURI(new URL(response.uploadURL!).pathname);

    const s3Key = s3KeyOriginal.replace(/^\/?original\//, "");

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

  useUppyEvent(uppy, "upload-error", (file, error) => {
    console.error("Upload error:", error);
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

  const onRemoveFile = useCallback(
    (fileId?: string, uppyFileId?: string) => {
      if (uppyFileId) uppy.removeFile(uppyFileId);

      // TODO: Remove file from cart item
      if (fileId) console.log("Removing file from cart item");
    },
    [uppy]
  );

  return (
    <Flex direction="column" gap="4">
      <Text
        className="flex items-center justify-center border border-dashed border-gray-8 p-6 rounded-3 text-gray-11 cursor-pointer hover:bg-gray-3"
        as="label"
      >
        <Flex direction="column" align="center" gap="2">
          <PlusCircleIcon className="size-10" />
          <Text color="gray" align="center" className="max-w-xs">
            Pridajte súbory kliknutím alebo ich pretiahnite hocikde na stránku
          </Text>
        </Flex>

        <VisuallyHidden>{t("add")}</VisuallyHidden>

        <input
          type="file"
          multiple
          accept={SUPPORTED_FILE_TYPES.join(",")}
          onChange={onFileInputChange}
          className="hidden"
        />
      </Text>

      {/* <Text
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
      </Text> */}
      <Grid
        columns={{
          initial: "2",
          xs: "3",
          sm: "5",
          md: "3",
          lg: "4",
        }}
        gap="4"
        width="full"
      >
        {combinedFiles.map((file) => (
          <FileItem
            key={file.id}
            id={file.id}
            uppyFileId={"uppyFile" in file ? file.uppyFile?.id : undefined}
            fullName={file.name}
            size={file.size}
            s3Key={"s3Key" in file ? file.s3Key : undefined}
            progressPercentage={
              "uppyFile" in file ? file.uppyFile.progress.percentage : undefined
            }
            progressBytes={
              "uppyFile" in file
                ? file.uppyFile.progress.bytesUploaded || 0
                : undefined
            }
            isUploading={"uppyFile" in file}
            hasThumbnail={"hasThumbnail" in file && file.hasThumbnail}
            onRemoveFile={onRemoveFile}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default Files;

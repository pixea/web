"use client";

import { useCallback, useEffect, useState } from "react";
import { Flex, Grid, Text } from "@radix-ui/themes";
import Uppy, { Meta } from "@uppy/core";
import { useUppyState, useUppyEvent } from "@uppy/react";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
import { useLocale, useTranslations } from "next-intl";
import type { Locale as UppyLocale } from "@uppy/utils/lib/Translator";

import {
  formatFileSize,
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
import { PlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

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
  removeFileFromCartItem: (cartItemId: string, fileId: string) => void;
}

const Files = ({
  cartId,
  itemId,
  files,
  isAuthenticated,
  addFileToCartItem,
  removeFileFromCartItem,
}: Props) => {
  const t = useTranslations("OrderItem");
  const locale = useLocale() as Locales;

  const [isDragging, setIsDragging] = useState(false);

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
      // Allow duplicates
      onBeforeFileAdded: () => true,
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

  const addFiles = useCallback(
    (files: File[]) =>
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
            (err as RestrictionError<Meta, Record<string, unknown>>)
              .isRestriction
          ) {
            // TODO: handle restrictions
            console.log("Restriction error:", err);
          } else {
            // TODO: handle other errors
            console.error(err);
          }
        }
      }),
    [uppy, cartId, itemId]
  );

  useEffect(() => {
    let dragCount = 0;
    const onDragEnterLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCount += e.type === "dragenter" ? 1 : -1;
      if (dragCount === 1) {
        setIsDragging(true);
      } else if (dragCount === 0) {
        setIsDragging(false);
      }
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();

      setIsDragging(false);
      dragCount = 0;

      if (!e.dataTransfer) return;

      let files: File[] = [];
      if (e.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        files = [...e.dataTransfer.items]
          .map((item) =>
            // If dropped items aren't files, ignore them
            item.kind === "file" ? item.getAsFile() : undefined
          )
          .filter((item) => !!item);
      } else {
        // Use DataTransfer interface to access the file(s)
        files = [...e.dataTransfer.files];
      }

      addFiles(files);
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragenter", onDragEnterLeave);
    document.addEventListener("dragleave", onDragEnterLeave);
    document.addEventListener("drop", onDrop);

    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragenter", onDragEnterLeave);
      document.removeEventListener("dragleave", onDragEnterLeave);
      document.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files?.length) return;

    const files = Array.from(event.target.files);

    addFiles(files);

    event.target.value = "";
  };

  const combinedFiles = combineFiles(
    Object.values(uploadingFiles),
    files?.items
  );

  const onRemoveFile = useCallback(
    (fileId?: string, uppyFileId?: string) => {
      if (uppyFileId) uppy.removeFile(uppyFileId);

      if (fileId) {
        // TODO: Add error handling
        removeFileFromCartItem(itemId, fileId);
      }
    },
    [itemId, removeFileFromCartItem, uppy]
  );

  const dropZoneClasses = cn(
    "flex items-center justify-center border border-dashed border-gray-8 p-6 rounded-3 cursor-pointer",
    {
      "text-gray-11 hover:bg-gray-3": !isDragging,
      "text-blue-11 bg-blue-3": isDragging,
    }
  );

  return (
    <Flex direction="column" gap="4">
      <Text className={dropZoneClasses} as="label">
        <Flex
          direction="column"
          align="center"
          gap="5"
          className="max-w-sm text-center"
          my="2"
        >
          <Flex direction="column" align="center" gap="3">
            <PlusIcon className="size-9" />
            <Text color="gray" weight="medium">
              {t("upload")}
            </Text>
          </Flex>

          <Flex direction="column" align="center" gap="1">
            <Text color="gray" size="1" className="flex items-center gap-1.5">
              {t("maxFileSize")}:{" "}
              {formatFileSize(
                isAuthenticated ? MAX_FILE_SIZE : MAX_UNAUTHENTICATED_FILE_SIZE
              )}
            </Text>
            <Text color="gray" size="1">
              {SUPPORTED_FILE_TYPES.slice(1).join(", ")}
            </Text>
          </Flex>
        </Flex>

        <input
          type="file"
          multiple
          accept={SUPPORTED_FILE_TYPES.join(",")}
          onChange={onFileInputChange}
          className="hidden"
        />
      </Text>
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
            width={
              "metadata" in file ? (file.metadata?.width as number) : undefined
            }
            height={
              "metadata" in file ? (file.metadata?.height as number) : undefined
            }
            progressPercentage={
              "uppyFile" in file ? file.uppyFile.progress.percentage : undefined
            }
            progressBytes={
              "uppyFile" in file
                ? file.uppyFile.progress.bytesUploaded || 0
                : undefined
            }
            isUploading={"s3Key" in file === false || !file.s3Key}
            hasThumbnail={"hasThumbnail" in file && file.hasThumbnail}
            onRemoveFile={onRemoveFile}
          />
        ))}
      </Grid>
    </Flex>
  );
};

export default Files;

"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Progress,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import Uppy, { Meta, UppyFile } from "@uppy/core";
import { useUppyState, useUppyEvent } from "@uppy/react";
import AwsS3, { type AwsBody } from "@uppy/aws-s3";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

const MULTIPART_THRESHOLD = 128 * 1024 * 1024;
const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 4;
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

const Files = ({ id }: { id: string }) => {
  const t = useTranslations("Order");

  const [uppy] = useState(() =>
    new Uppy<Meta, AwsBody>({
      id,
      autoProceed: true,
      restrictions: {
        maxFileSize: MAX_FILE_SIZE,
        allowedFileTypes: SUPPORTED_FILE_TYPES,
      },
    }).use(AwsS3, {
      id: "b2",
      shouldUseMultipart: (file) =>
        !!file.size && file.size > MULTIPART_THRESHOLD,

      /**
       * This method tells Uppy how to handle non-multipart uploads.
       */
      async getUploadParameters(file, options) {
        // TODO: Use server action
        const response = await fetch("/api/s3/single-part", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            contentType: file.type,
          }),
          signal: options.signal,
        });

        // TODO: Handle errors
        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });

        const data = await response.json();

        return {
          method: data.method,
          url: data.url,
          // For presigned PUT uploads, this should be left empty.
          fields: {},
          headers: {
            "Content-Type": file.type,
          },
        };
      },

      async createMultipartUpload(
        file: UppyFile<Meta, Record<string, unknown>>,
        signal?: AbortSignal
      ) {
        signal?.throwIfAborted();

        const metadata = {} as Meta;

        Object.keys(file.meta || {}).forEach((key) => {
          if (file.meta[key] != null) {
            metadata[key] = file.meta[key].toString();
          }
        });

        const response = await fetch("/api/s3/multipart", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            filename: file.name,
            type: file.type,
            metadata,
          }),
          signal,
        });

        // TODO: Handle errors
        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });

        const data = await response.json();

        return data;
      },

      async abortMultipartUpload(_file, { key, uploadId, signal }) {
        const filename = encodeURIComponent(key);
        const uploadIdEnc = encodeURIComponent(uploadId);
        const response = await fetch(
          `/api/s3/multipart/${uploadIdEnc}?key=${filename}`,
          {
            method: "DELETE",
            signal,
          }
        );

        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });
      },

      async signPart(_file, options) {
        const { uploadId, key, partNumber, signal } = options;

        signal?.throwIfAborted();

        if (uploadId == null || key == null || partNumber == null) {
          throw new Error(
            "Cannot sign without a key, an uploadId, and a partNumber"
          );
        }

        const filename = encodeURIComponent(key);
        const response = await fetch(
          `/api/s3/multipart/${uploadId}/${partNumber}?key=${filename}`,
          { signal }
        );

        // TODO: Handle errors
        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });

        const data = await response.json();

        return data;
      },

      async listParts(_file, { key, uploadId, signal }) {
        signal?.throwIfAborted();

        const filename = encodeURIComponent(key);
        const response = await fetch(
          `/api/s3/multipart/${uploadId}?key=${filename}`,
          { signal }
        );

        // TODO: Handle errors
        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });

        const data = await response.json();

        return data;
      },

      async completeMultipartUpload(_file, { key, uploadId, parts, signal }) {
        signal?.throwIfAborted();

        const filename = encodeURIComponent(key);
        const uploadIdEnc = encodeURIComponent(uploadId);
        const response = await fetch(
          `/api/s3/multipart/${uploadIdEnc}/complete?key=${filename}`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({ parts }),
            signal,
          }
        );

        if (!response.ok)
          throw new Error("Unsuccessful request", { cause: response });

        const data = await response.json();

        return data;
      },
    })
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
        if (err.isRestriction) {
          // handle restrictions
          console.log("Restriction error:", err);
        } else {
          // handle other errors
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
      <Text as="label" className="bg-gray-2 rounded-3 h-[8rem] p-0">
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
        <Button
          key={file.id}
          className="bg-gray-2 rounded-3 h-[8rem] relative text-left p-0 overflow-hidden"
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
      ))}
    </Grid>
  );
};

export default Files;

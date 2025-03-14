import { memo } from "react";
import { formatFileSize, UNSUPPORTED_PREVIEW_EXTENSIONS } from "@/utils/file";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Progress,
  Spinner,
  Text,
  Tooltip,
  Dialog,
  Inset,
  Badge,
  Separator,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

interface Props {
  id: string;
  uppyFileId?: string;
  fullName: string;
  size?: number;
  s3Key?: string;
  width?: number;
  height?: number;
  density?: number;
  channels?: number;
  hasProfile?: boolean;
  progressPercentage?: number;
  progressBytes?: number;
  isUploading: boolean;
  hasThumbnail: boolean;
  onRemoveFile: (fileId?: string, uppyFileId?: string) => void;
}

const FileItem = ({
  id,
  uppyFileId,
  fullName,
  size,
  s3Key,
  width,
  height,
  density,
  channels,
  hasProfile,
  progressPercentage,
  progressBytes,
  isUploading,
  hasThumbnail,
  onRemoveFile,
}: Props) => {
  const t = useTranslations("Order");

  const lastDotIndex = fullName.lastIndexOf(".");
  const name =
    lastDotIndex === -1 ? fullName : fullName.substring(0, lastDotIndex);
  const extension =
    lastDotIndex === -1
      ? ""
      : fullName.substring(lastDotIndex).replace(/\./g, "").toUpperCase();

  const isPreviewable =
    hasThumbnail && !UNSUPPORTED_PREVIEW_EXTENSIONS.includes(extension);

  const color = channels === 3 ? "sRGB" : channels === 4 ? "CMYK" : undefined;

  return (
    <Flex direction="column" className="ring-1 ring-gray-6 rounded-3">
      <Box className="bg-gray-2 rounded-t-3 h-32 relative text-left p-0 overflow-hidden">
        <Dialog.Root>
          <Tooltip content={isUploading ? t("uploading") : t("open")}>
            <Dialog.Trigger>
              <Button
                color="gray"
                disabled={isUploading}
                className="relative size-full text-accent-contrast p-0 bg-gray-3 hover:opacity-60 transition-all"
              >
                {!isUploading && !hasThumbnail && (
                  <Text
                    color="gray"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl mt-1"
                  >
                    {extension}
                  </Text>
                )}

                {hasThumbnail && (
                  <Image
                    unoptimized
                    src={`/api/s3/thumbnail/${s3Key}`}
                    alt=""
                    width={256}
                    height={256}
                    className="object-cover size-full"
                    onError={(event) =>
                      ((event.target as HTMLImageElement).style.display =
                        "none")
                    }
                  />
                )}
                {isUploading && (
                  <>
                    <Progress
                      value={progressPercentage || 0}
                      color="blue"
                      variant="soft"
                      radius="none"
                      className="absolute top-0 left-0 size-full bg-blue-5"
                    />
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      className="transform -translate-x-1/2 -translate-y-1/2 text-3xl mt-1"
                    >
                      {progressPercentage === 100 ? (
                        <Spinner size="3" />
                      ) : (
                        (progressPercentage || 0) + "%"
                      )}
                    </Box>
                  </>
                )}
              </Button>
            </Dialog.Trigger>
          </Tooltip>

          <Dialog.Content className="pt-0">
            <Flex direction="column" gap="3">
              <Inset side="x" mb="4">
                <Flex
                  className={cn(
                    "relative flex items-center justify-center w-full bg-gray-3",
                    !isPreviewable ? "h-48" : "h-full"
                  )}
                >
                  {!isPreviewable && (
                    <Text
                      color="gray"
                      weight="medium"
                      className="text-2xl"
                      mx="5"
                    >
                      {extension}
                    </Text>
                  )}

                  {isPreviewable && s3Key && (
                    <Image
                      unoptimized
                      src={`/api/s3/download?key=${encodeURIComponent(s3Key)}`}
                      alt=""
                      width={width || 4000}
                      height={height || 3000}
                      className="object-contain w-full h-auto max-h-[calc(90vh-9rem)]"
                      onError={(event) =>
                        ((event.target as HTMLImageElement).style.display =
                          "none")
                      }
                    />
                  )}
                </Flex>
              </Inset>

              <Dialog.Title mb="-1" mt="1">
                {name}
              </Dialog.Title>

              <Flex direction="row" align="center" gapX="2">
                <Text color="gray" size="2" weight="medium">
                  {extension ? extension : undefined}
                </Text>
                <Text color="gray" size="1">
                  {size ? formatFileSize(size) : "N/A"}
                </Text>

                {(width && height) || density || color || hasProfile ? (
                  <>
                    <Separator orientation="vertical" />

                    <Flex direction="row" align="center" gap="2">
                      {width && height ? (
                        <Badge color="gray" size="2" variant="surface">
                          {width} x {height} px
                        </Badge>
                      ) : undefined}

                      {density ? (
                        <Badge color="gray" size="2" variant="surface">
                          {density} DPI
                        </Badge>
                      ) : undefined}

                      {color ? (
                        <Badge color="gray" size="2" variant="surface">
                          {color}
                        </Badge>
                      ) : undefined}

                      {hasProfile ? (
                        <Badge color="gray" size="2" variant="surface">
                          ICC
                        </Badge>
                      ) : undefined}
                    </Flex>
                  </>
                ) : undefined}
              </Flex>
            </Flex>

            <Flex gap="3" mt="5" justify="between">
              <Dialog.Close>
                <Button
                  variant="soft"
                  color="red"
                  onClick={() => onRemoveFile(id, uppyFileId)}
                >
                  {t("remove")}
                </Button>
              </Dialog.Close>

              <Flex gap="3">
                {s3Key && (
                  <Button asChild variant="soft" color="gray">
                    <a
                      href={`/api/s3/download?key=${encodeURIComponent(s3Key)}`}
                      target="_blank"
                      download={fullName}
                    >
                      <ArrowDownTrayIcon className="size-4" /> {t("download")}
                    </a>
                  </Button>
                )}
                <Dialog.Close>
                  <Button>{t("close")}</Button>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>

        <Tooltip content={t("remove")}>
          <IconButton
            className="absolute top-0 right-0 ring-1 ring-gray-6 bg-panel-solid text-gray-11 rounded-tl-none rounded-br-none hover:bg-red-9 hover:text-white hover:ring-red-6 m-0"
            onClick={() => onRemoveFile(id, uppyFileId)}
          >
            <XMarkIcon className="size-5" />
          </IconButton>
        </Tooltip>
      </Box>

      <Tooltip content={fullName}>
        <Flex
          direction="column"
          py="1"
          px="2"
          className="bg-panel-solid border-t border-gray-6 rounded-b-3 text-gray-12 text-sm"
        >
          <Text className="truncate">{name}</Text>

          <Flex direction="row" align="center" justify="between">
            <Text color="gray" size="1">
              {isUploading
                ? formatFileSize(progressBytes || 0) + " / "
                : undefined}{" "}
              {size ? formatFileSize(size) : "N/A"}
            </Text>
            <Text color="gray" size="1">
              {!isUploading ? extension : undefined}
            </Text>
          </Flex>
        </Flex>
      </Tooltip>
    </Flex>
  );
};

export default memo(FileItem);

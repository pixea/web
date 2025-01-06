import { memo } from "react";
import { formatFileSize } from "@/utils/file";
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
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  id: string;
  uppyFileId?: string;
  fullName: string;
  size?: number;
  s3Key?: string;
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

  return (
    <Flex direction="column" className="ring-1 ring-gray-6 rounded-3">
      <Box className="bg-gray-2 rounded-t-3 h-[8rem] relative text-left p-0 overflow-hidden">
        <Tooltip content={isUploading ? t("uploading") : t("open")}>
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
                  ((event.target as HTMLImageElement).style.display = "none")
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
        </Tooltip>

        <Tooltip content={t("removeFile")}>
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

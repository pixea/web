import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import convertHeic from "heic-convert";

import { getS3Client } from "./s3";
import { OrderItemFilePayload } from "@/db/validation";
import {
  HEIC_TYPES,
  MAX_THUMBNAIL_SIZE,
  MAX_UNAUTHENTICATED_THUMBNAIL_SIZE,
  SUPPORTED_THUMBNAIL_TYPES,
} from "./file";
import { getSharp } from "next/dist/server/image-optimizer";

export const createThumbnail = async (
  file: OrderItemFilePayload,
  isAuthenticated: boolean
) => {
  const maxThumbnailSize = isAuthenticated
    ? MAX_THUMBNAIL_SIZE
    : MAX_UNAUTHENTICATED_THUMBNAIL_SIZE;

  const s3 = getS3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: `original/${file.s3Key}`,
  });

  const object = await s3.send(getObjectCommand);

  if (!object.ContentLength || object.ContentLength > maxThumbnailSize) {
    throw new Error(
      `Cannot create thumbnail for object with content length '${object.ContentLength}'.`
    );
  }

  if (
    !object.ContentType ||
    !SUPPORTED_THUMBNAIL_TYPES.includes(object.ContentType)
  ) {
    throw new Error(
      `Cannot create thumbnail for object with content type '${object.ContentType}'.`
    );
  }

  const isHeic = HEIC_TYPES.includes(object.ContentType);

  const input = isHeic
    ? await convertHeic({
        buffer: (await object.Body!.transformToByteArray()).buffer,
        format: "JPEG",
      })
    : await object.Body!.transformToByteArray();

  const sharp = getSharp(undefined);

  const sharpInput = sharp(input);

  const metadata = await sharpInput.metadata();

  const selectMetadata = {
    type: isHeic ? "heic" : metadata.format?.toString(),
    width: metadata.width,
    height: metadata.height,
    channels: metadata.channels,
    density: metadata.density,
    resolutionUnit: metadata.resolutionUnit,
    hasProfile: metadata.hasProfile,
    orientation: metadata.orientation,
    space: metadata.space?.toString(),
  };

  const thumbnailBuffer = await sharpInput
    .rotate()
    .resize(256, 256, {
      fit: sharp.fit.cover,
      position: sharp.strategy.attention,
    })
    .jpeg({ optimizeScans: true })
    .toBuffer();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: `thumbnail/${file.s3Key}`,
    Body: thumbnailBuffer,
    ContentType: "image/jpeg",
  });

  await s3.send(putObjectCommand);

  return selectMetadata;
};

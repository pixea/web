import type { Meta } from "@uppy/core";

export const MAX_UNAUTHENTICATED_FILE_SIZE = 1024 * 1024 * 100; // 100MB
export const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 10; // 10GB

export const MAX_UNAUTHENTICATED_THUMBNAIL_SIZE = 1024 * 1024 * 16; // 16MB
export const MAX_THUMBNAIL_SIZE = 1024 * 1024 * 128; // 128MB

export const MULTIPART_THRESHOLD = 1024 * 1024 * 128; // 128MB

export interface UppyMetadata extends Meta {
  cartId: string;
  itemId: string;
  fileId: string;
}

export const SUPPORTED_FILE_TYPES = [
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

export const HEIC_TYPES = ["image/heic", "image/heif"];

export const SUPPORTED_THUMBNAIL_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/x-png",
  "image/webp",
  "image/x-webp",
  "image/avif",
  "image/tiff",
  "image/x-tiff",
  "image/gif",
  "image/svg+xml",
  "image/svg",
  "application/svg+xml",
  ...HEIC_TYPES,
];
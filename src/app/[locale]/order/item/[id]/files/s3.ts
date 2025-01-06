import { MULTIPART_THRESHOLD } from "@/utils/file";
import { AwsS3MultipartOptions } from "@uppy/aws-s3";
import { Meta, UppyFile } from "@uppy/core";

export const s3PluginOptions = {
  id: "b2",
  shouldUseMultipart: (file) => !!file.size && file.size > MULTIPART_THRESHOLD,

  /**
   * This method tells Uppy how to handle non-multipart uploads.
   */
  async getUploadParameters(file, options) {
    // TODO: Use server action once they can be aborted
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
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        metadata,
      }),
      signal,
    });

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    return response.json();
  },

  async abortMultipartUpload(_file, { key, uploadId, signal }) {
    const response = await fetch(
      `/api/s3/multipart?${new URLSearchParams({
        key,
        uploadId,
      })}`,
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

    const response = await fetch(
      `/api/s3/multipart?${new URLSearchParams({
        key,
        uploadId,
        partNumber: partNumber.toString(),
      })}`,
      { signal }
    );

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    return response.json();
  },

  async listParts(_file, { key, uploadId, signal }) {
    signal?.throwIfAborted();

    const response = await fetch(
      `/api/s3/multipart-list?${new URLSearchParams({
        key,
        uploadId,
      })}`,
      { signal }
    );

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    return response.json();
  },

  async completeMultipartUpload(_file, { key, uploadId, parts, signal }) {
    signal?.throwIfAborted();

    const response = await fetch("/api/s3/multipart-completion", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        uploadId,
        key,
        parts,
      }),
      signal,
    });

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    return response.json();
  },
} satisfies AwsS3MultipartOptions<Meta, Record<string, unknown>>;

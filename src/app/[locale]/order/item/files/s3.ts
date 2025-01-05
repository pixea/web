import { AwsS3MultipartOptions } from "@uppy/aws-s3";
import { Meta, UppyFile } from "@uppy/core";

const MULTIPART_THRESHOLD = 128 * 1024 * 1024;

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
        orderId: "abc123",
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
        orderId: "abc123",
        metadata,
      }),
      signal,
    });

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    return response.json();
  },

  async abortMultipartUpload(_file, { key, uploadId, signal }) {
    const filename = encodeURIComponent(key);
    const uploadIdEnc = encodeURIComponent(uploadId);
    const response = await fetch(
      `/api/s3/multipart/?uploadId=${uploadIdEnc}&key=${filename}`,
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
      `/api/s3/multipart?uploadId=${uploadId}&partNumber=${partNumber}&key=${filename}`,
      { signal }
    );

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    const data = await response.json();

    return data;
  },

  async listParts(_file, { key, uploadId, signal }) {
    signal?.throwIfAborted();

    const filename = encodeURIComponent(key);
    const response = await fetch(
      `/api/s3/multipart-list?uploadId=${uploadId}&key=${filename}`,
      { signal }
    );

    if (!response.ok)
      throw new Error("Unsuccessful request", { cause: response });

    const data = await response.json();

    return data;
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

    const data = await response.json();

    return data;
  },
} satisfies AwsS3MultipartOptions<Meta, Record<string, unknown>>;

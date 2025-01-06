import { auth } from "@/auth";
import { getCurrentCartContentAction } from "@/hooks/useCart/actions";
import { MAX_FILE_SIZE, MAX_UNAUTHENTICATED_FILE_SIZE } from "@/utils/file";
import { getS3Client } from "@/utils/s3";
import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListPartsCommand,
  PutObjectCommand,
  UploadPartCommand,
  ListPartsOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNATURE_EXPIRATION = 60 * 60 * 12; // Define how long until an S3 signature expires.

export async function POST(
  request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;

  const session = await auth();
  const isAuthenticated = !!session?.user;

  const cart = await getCurrentCartContentAction();
  const cartId = cart.content.id;

  // Unauthenticated users are able to get only a single-part signature on up to 100MB files.
  if (segment === "single-part") {
    const { contentType, fileSize, fileName } = (await request.json()) as {
      fileName: string;
      fileSize: number;
      contentType: string;
    };

    if (typeof fileName !== "string" || !fileName) {
      return new Response("Missing file name", { status: 400 });
    }

    const maxSize = isAuthenticated
      ? MAX_FILE_SIZE
      : MAX_UNAUTHENTICATED_FILE_SIZE;
    if (!isAuthenticated && fileSize > maxSize) {
      return new Response("File too large", { status: 400 });
    }

    const key = `original/${session?.user.id || "public"}/${cartId}/${crypto.randomUUID()}/${fileName}`;

    const signedUrl = await getSignedUrl(
      getS3Client(),
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: SIGNATURE_EXPIRATION }
    );

    return Response.json(
      { url: signedUrl, key, method: "PUT" },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (segment === "multipart") {
    // Multipart uploads are allowed for authenticated users only.
    // They technically allow unlimited file sizes.
    if (!isAuthenticated) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { contentType, fileSize, fileName, metadata } =
      (await request.json()) as {
        fileName: string;
        fileSize: number;
        contentType: string;
        metadata: Record<string, string>;
      };

    if (typeof fileName !== "string" || !fileName) {
      return new Response("Missing file name", { status: 400 });
    }

    if (!isAuthenticated && fileSize > MAX_FILE_SIZE) {
      return new Response("File too large", { status: 400 });
    }

    const key = `original/${session?.user.id || "public"}/${cartId}/${crypto.randomUUID()}/${fileName}`;

    const params = {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      ContentType: contentType,
      Metadata: metadata,
    };

    const command = new CreateMultipartUploadCommand(params);

    try {
      const data = await getS3Client().send(command);

      return Response.json(
        { key, uploadId: data.UploadId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (e) {
      console.error(e);
      return new Response("Failed to create multipart upload", { status: 500 });
    }
  }

  if (segment === "multipart-completion") {
    const { key, uploadId, parts } = (await request.json()) as {
      key: string;
      uploadId: string;
      parts: { ETag: string; PartNumber: number }[];
    };

    if (typeof key !== "string") {
      return new Response("Missing object key", { status: 400 });
    }
    if (typeof uploadId !== "string") {
      return new Response("Missing upload ID", { status: 400 });
    }
    if (!Array.isArray(parts) || !parts.every(isValidPart)) {
      return new Response("Invalid parts", { status: 400 });
    }

    try {
      await getS3Client().send(
        new CompleteMultipartUploadCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: parts,
          },
        })
      );

      return Response.json(
        { message: "Multipart upload completed", key },
        { status: 200 }
      );
    } catch (e) {
      console.error(e);
      return new Response("Failed to complete multipart upload", {
        status: 500,
      });
    }
  }
}

const validatePartNumber = (partNumber: number) =>
  Number.isInteger(partNumber) && partNumber >= 1 && partNumber <= 10_000;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;

  if (segment === "multipart") {
    const searchParams: URLSearchParams = new URL(request.url).searchParams;
    const key = searchParams.get("key");
    const uploadId = searchParams.get("uploadId");
    const partNumber = searchParams.get("partNumber");

    if (!key || !uploadId) {
      return new Response("key and uploadId are required", { status: 400 });
    }

    if (!validatePartNumber(Number(partNumber))) {
      return new Response("Invalid part number", { status: 400 });
    }

    const signedUrl = await getSignedUrl(
      getS3Client(),
      new UploadPartCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        UploadId: uploadId,
        PartNumber: Number(partNumber),
        Body: "",
      }),
      { expiresIn: SIGNATURE_EXPIRATION }
    );

    return Response.json(
      { url: signedUrl, expires: SIGNATURE_EXPIRATION },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (segment === "multipart-list") {
    const searchParams: URLSearchParams = new URL(request.url).searchParams;
    const key = searchParams.get("key") as string;
    const uploadId = searchParams.get("uploadId") as string;

    if (!key || !uploadId) {
      return new Response("key and uploadId are required", { status: 400 });
    }

    const parts: NonNullable<ListPartsOutput["Parts"]> = [];

    async function listPartsPage(startsAt?: string) {
      try {
        const data = await getS3Client().send(
          new ListPartsCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: key,
            UploadId: uploadId,
            PartNumberMarker: startsAt,
          })
        );

        parts.push(...(data.Parts || []));

        if (data.IsTruncated) {
          await listPartsPage(data.NextPartNumberMarker);
        }
      } catch (e) {
        console.error(e);
        return new Response("Failed to list parts", { status: 500 });
      }
    }

    await listPartsPage();

    return Response.json(parts, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

function isValidPart(part: { ETag: string; PartNumber: number }) {
  return (
    part &&
    typeof part === "object" &&
    Number(part.PartNumber) &&
    typeof part.ETag === "string"
  );
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = new URL(request.url).searchParams;

  if (segment === "multipart") {
    const uploadId = searchParams.get("uploadId");
    const key = searchParams.get("key");

    console.log({ uploadId, key });

    if (typeof uploadId !== "string") {
      return new Response("Missing upload ID", { status: 400 });
    }
    if (typeof key !== "string") {
      return new Response("Missing object key", { status: 400 });
    }

    try {
      await getS3Client().send(
        new AbortMultipartUploadCommand({
          Bucket: "pixea-upload",
          Key: key,
          UploadId: uploadId,
        })
      );

      return Response.json(
        { message: "Aborted multipart upload." },
        { status: 200 }
      );
    } catch (e) {
      console.error(e);
      return new Response("Failed to abort multipart upload", { status: 500 });
    }
  }
}

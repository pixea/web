import { GetObjectCommand, GetObjectCommandOutput } from "@aws-sdk/client-s3";

import { getS3Client } from "@/utils/s3";

const THUMBNAIL_TTL = 60 * 60 * 24 * 30; // 30 days

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;

  const s3Client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: `thumbnail/${key.join("/")}`,
  });

  let object: GetObjectCommandOutput;
  try {
    object = await s3Client.send(command);
  } catch (e: unknown) {
    if ((e as Error)?.name === "NoSuchKey") {
      return new Response("Not found", { status: 404 });
    }

    console.error(e);
    return new Response("Internal server error", { status: 500 });
  }

  return new Response(object.Body?.transformToWebStream(), {
    status: 200,
    headers: new Headers({
      "content-type": object.ContentType!,
      "content-length": object.ContentLength!.toString(),
      "cache-control": `s-maxage=${THUMBNAIL_TTL}`,
    }),
  });
}

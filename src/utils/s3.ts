import { S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client;
export function getS3Client() {
  s3Client ??= new S3Client({
    credentials: {
      accessKeyId: process.env.S3_KEY_ID!,
      secretAccessKey: process.env.S3_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT!,
    region: process.env.S3_REGION!,
  });

  return s3Client;
}

import { auth } from "@/auth";
import {
  S3Client,
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  ListPartsCommand,
  PutObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const SIGNATURE_EXPIRATION = 60 * 60 * 12; // Define how long until an S3 signature expires.

let s3Client: S3Client;
function getS3Client() {
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ segment: string }> }
) {
  const { segment } = await params;

  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Unauthenticated users are able to get only a single-part signature on up to 100MB files.
  if (segment === "single-part") {
    const { contentType, fileSize, fileName } = request.body as unknown as {
      fileName: string;
      fileSize: number;
      contentType: string;
    };

    if (!isAuthenticated && fileSize > 100 * 1024 * 1024) {
      return new Response("File too large", { status: 403 });
    }

    const key = `original/${session?.user.id || "public"}/${crypto.randomUUID()}/${fileName}`;

    const signedUrl = await getSignedUrl(
      getS3Client(),
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        ContentType: contentType,
      }),
      { expiresIn: SIGNATURE_EXPIRATION }
    );

    return new Response(JSON.stringify({ url: signedUrl, method: "PUT" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ segment: string }> }
// ) {
//   const { segment } = await params;

//   const session = await auth();
//   const isAuthenticated = !!session?.user;

//   const { type, metadata, filename } = req.body;
//   if (typeof filename !== "string") {
//     return res
//       .status(400)
//       .json({ error: "s3: content filename must be a string" });
//   }
//   if (typeof type !== "string") {
//     return res.status(400).json({ error: "s3: content type must be a string" });
//   }
//   const Key = `${crypto.randomUUID()}-${filename}`;

//   const params = {
//     Bucket: "pixea-upload",
//     Key,
//     ContentType: type,
//     Metadata: metadata,
//   };

//   const command = new CreateMultipartUploadCommand(params);

//   return client.send(command, (err, data) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.setHeader("Access-Control-Allow-Origin", accessControlAllowOrigin);
//     res.json({
//       key: data.Key,
//       uploadId: data.UploadId,
//     });
//   });
// }

// app.post("/s3/multipart", (req, res, next) => {});

// function validatePartNumber(partNumber) {
//   // eslint-disable-next-line no-param-reassign
//   partNumber = Number(partNumber);
//   return (
//     Number.isInteger(partNumber) && partNumber >= 1 && partNumber <= 10_000
//   );
// }
// app.get("/s3/multipart/:uploadId/:partNumber", (req, res, next) => {
//   const { uploadId, partNumber } = req.params;
//   const { key } = req.query;

//   if (!validatePartNumber(partNumber)) {
//     return res.status(400).json({
//       error: "s3: the part number must be an integer between 1 and 10000.",
//     });
//   }
//   if (typeof key !== "string") {
//     return res.status(400).json({
//       error:
//         's3: the object key must be passed as a query parameter. For example: "?key=abc.jpg"',
//     });
//   }

//   return getSignedUrl(
//     getS3Client(),
//     new UploadPartCommand({
//       Bucket: "pixea-upload",
//       Key: key,
//       UploadId: uploadId,
//       PartNumber: partNumber,
//       Body: "",
//     }),
//     { expiresIn }
//   ).then((url) => {
//     res.setHeader("Access-Control-Allow-Origin", accessControlAllowOrigin);
//     res.json({ url, expires: expiresIn });
//   }, next);
// });

// app.get("/s3/multipart/:uploadId", (req, res, next) => {
//   const client = getS3Client();
//   const { uploadId } = req.params;
//   const { key } = req.query;

//   if (typeof key !== "string") {
//     res.status(400).json({
//       error:
//         's3: the object key must be passed as a query parameter. For example: "?key=abc.jpg"',
//     });
//     return;
//   }

//   const parts = [];

//   function listPartsPage(startsAt = undefined) {
//     client.send(
//       new ListPartsCommand({
//         Bucket: "pixea-upload",
//         Key: key,
//         UploadId: uploadId,
//         PartNumberMarker: startsAt,
//       }),
//       (err, data) => {
//         if (err) {
//           next(err);
//           return;
//         }

//         parts.push(...data.Parts);

//         // continue to get list of all uploaded parts until the IsTruncated flag is false
//         if (data.IsTruncated) {
//           listPartsPage(data.NextPartNumberMarker);
//         } else {
//           res.json(parts);
//         }
//       }
//     );
//   }
//   listPartsPage();
// });

// function isValidPart(part) {
//   return (
//     part &&
//     typeof part === "object" &&
//     Number(part.PartNumber) &&
//     typeof part.ETag === "string"
//   );
// }
// app.post("/s3/multipart/:uploadId/complete", (req, res, next) => {
//   const client = getS3Client();
//   const { uploadId } = req.params;
//   const { key } = req.query;
//   const { parts } = req.body;

//   console.log("Hmmm");

//   if (typeof key !== "string") {
//     console.log("Hmmmm1");

//     return res.status(400).json({
//       error:
//         's3: the object key must be passed as a query parameter. For example: "?key=abc.jpg"',
//     });
//   }
//   if (!Array.isArray(parts) || !parts.every(isValidPart)) {
//     console.log("Hmmmm2", parts);

//     return res.status(400).json({
//       error: "s3: `parts` must be an array of {ETag, PartNumber} objects.",
//     });
//   }

//   return client.send(
//     new CompleteMultipartUploadCommand({
//       Bucket: "pixea-upload",
//       Key: key,
//       UploadId: uploadId,
//       MultipartUpload: {
//         Parts: parts,
//       },
//     }),
//     (err, data) => {
//       console.log("Hmmmm3");
//       console.error(err);

//       if (err) {
//         next(err);
//         return;
//       }
//       res.setHeader("Access-Control-Allow-Origin", accessControlAllowOrigin);
//       res.json({
//         location: data.Location,
//       });
//     }
//   );
// });

// export async function DELETE(request: Request) {}

// app.delete("/s3/multipart/:uploadId", (req, res, next) => {
//   const client = getS3Client();
//   const { uploadId } = req.params;
//   const { key } = req.query;

//   if (typeof key !== "string") {
//     return res.status(400).json({
//       error:
//         's3: the object key must be passed as a query parameter. For example: "?key=abc.jpg"',
//     });
//   }

//   return client.send(
//     new AbortMultipartUploadCommand({
//       Bucket: "pixea-upload",
//       Key: key,
//       UploadId: uploadId,
//     }),
//     (err) => {
//       if (err) {
//         next(err);
//         return;
//       }
//       res.json({});
//     }
//   );
// });

// === </S3 MULTIPART> ===

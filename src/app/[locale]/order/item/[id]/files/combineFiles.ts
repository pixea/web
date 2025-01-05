import { OrderItemFilePayload } from "@/db/validation";
import { UppyMetadata } from "@/utils/file";
import { AwsBody } from "@uppy/aws-s3";
import { UppyFile } from "@uppy/core";

const combineFiles = (
  uploadingFiles: UppyFile<UppyMetadata, AwsBody>[],
  uploadedFiles?: OrderItemFilePayload[]
) => {
  const uploadingFilesById = new Map(
    uploadingFiles.map((file) => [file.meta.fileId, file])
  );
  const uploadedFilesById = new Map(
    uploadedFiles?.map((file) => [file.id, file]) || []
  );

  return [
    ...(uploadedFiles?.filter((file) => !uploadingFilesById.has(file.id)) ||
      []),
    ...uploadingFiles.map(
      (file) =>
        uploadedFilesById.get(file.meta.fileId) || {
          id: file.meta.fileId,
          name: file.name!,
          size: file.size!,
          uppyFile: file,
        }
    ),
  ];
};

export default combineFiles;

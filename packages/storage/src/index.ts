import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export type OciS3Config = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export function createStorage(config: OciS3Config) {
  const client = new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return {
    async getUploadUrl(key: string, contentType: string, expiresIn = 900) {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: contentType,
      });
      return getSignedUrl(client, command, { expiresIn });
    },

    async getDownloadUrl(key: string, expiresIn = 900) {
      const command = new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
      });
      return getSignedUrl(client, command, { expiresIn });
    },
  };
}

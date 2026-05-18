import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./config/env.js";

export type StoredImage = {
  bucket: string;
  objectKey: string;
  publicUrl: string;
  sizeBytes: number;
  mimeType: string;
  fileName: string;
};

const mimeTypes = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp"
} as const;

export async function storeGeneratedImage(input: {
  taskId: string;
  index: number;
  base64: string;
  format: keyof typeof mimeTypes;
}): Promise<StoredImage> {
  const buffer = Buffer.from(input.base64, "base64");
  const fileName = `${input.index}.${input.format}`;
  const objectKey = `${input.taskId}/${fileName}`;
  const mimeType = mimeTypes[input.format];

  if (env.STORAGE_DRIVER === "s3") {
    return storeS3Image({ buffer, objectKey, fileName, mimeType });
  }

  return storeLocalImage({ buffer, objectKey, fileName, mimeType, taskId: input.taskId });
}

async function storeLocalImage(input: {
  buffer: Buffer;
  objectKey: string;
  fileName: string;
  mimeType: string;
  taskId: string;
}): Promise<StoredImage> {
  const absoluteDir = path.resolve(env.LOCAL_STORAGE_DIR, input.taskId);
  const absolutePath = path.join(absoluteDir, input.fileName);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, input.buffer);

  return {
    bucket: "local",
    objectKey: input.objectKey,
    publicUrl: `${env.PUBLIC_ASSET_BASE_URL.replace(/\/$/, "")}/${input.objectKey}`,
    sizeBytes: input.buffer.byteLength,
    mimeType: input.mimeType,
    fileName: input.fileName
  };
}

async function storeS3Image(input: {
  buffer: Buffer;
  objectKey: string;
  fileName: string;
  mimeType: string;
}): Promise<StoredImage> {
  if (!env.S3_BUCKET || !env.S3_PUBLIC_BASE_URL) {
    throw new Error("S3_BUCKET and S3_PUBLIC_BASE_URL are required when STORAGE_DRIVER=s3.");
  }

  const client = new S3Client({
    region: env.AWS_REGION,
    credentials:
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY
          }
        : undefined
  });

  await client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: input.objectKey,
      Body: input.buffer,
      ContentType: input.mimeType
    })
  );

  return {
    bucket: env.S3_BUCKET,
    objectKey: input.objectKey,
    publicUrl: `${env.S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${input.objectKey}`,
    sizeBytes: input.buffer.byteLength,
    mimeType: input.mimeType,
    fileName: input.fileName
  };
}

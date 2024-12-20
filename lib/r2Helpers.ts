import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, CLOUDFLARE_R2_BUCKET } from './r2Client';

export async function uploadFileToR2(
  key: string,
  fileBuffer: Buffer,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Use the public R2.dev URL from environment variables
  // Make sure CLOUDFLARE_R2_PUBLIC_URL is set in your .env
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}

// Delete file from R2
export async function deleteFileFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Key: key,
  });

  await r2Client.send(command);

  return {
    success: true,
    message: `File with key ${key} deleted successfully`,
  };
}

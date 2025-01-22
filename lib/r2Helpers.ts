import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, CLOUDFLARE_R2_BUCKET } from './r2Client';

export async function uploadFileToR2(
  key: string,
  fileBuffer: Buffer,
  contentType: string
) {
  try {
    console.log(`Starting upload for file: ${key}`);

    const command = new PutObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await r2Client.send(command);

    // Return the public R2 URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    console.log(`Upload successful. Public URL: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw error;
  }
}

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

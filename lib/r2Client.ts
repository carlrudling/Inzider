import { S3Client } from '@aws-sdk/client-s3';

const {
  CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_ENDPOINT,
  CLOUDFLARE_R2_BUCKET,
} = process.env;

if (
  !CLOUDFLARE_R2_ACCESS_KEY_ID ||
  !CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  !CLOUDFLARE_R2_ENDPOINT ||
  !CLOUDFLARE_R2_BUCKET
) {
  throw new Error('Missing R2 configuration');
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export { r2Client, CLOUDFLARE_R2_BUCKET };

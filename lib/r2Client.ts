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

const client = new S3Client({
  region: 'auto',
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
});

client.middlewareStack.add(
  (next) => async (args) => {
    if (args.request && typeof args.request === 'object') {
      const request = args.request as { headers?: Record<string, string> };
      if (request.headers) {
        delete request.headers['x-amz-checksum-mode'];
        delete request.headers['x-amz-checksum-crc32'];
        request.headers['x-amz-checksum-algorithm'] = 'CRC32';
      }
    }
    return next(args);
  },
  {
    step: 'build',
    name: 'customHeaders',
  }
);

export const r2Client = client;
export { CLOUDFLARE_R2_BUCKET };

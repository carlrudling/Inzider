import { NextResponse } from 'next/server';
import { uploadFileToR2 } from '@/lib/r2Helpers';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type;

  // Generate a unique key for the file
  const fileKey = `${randomUUID()}-${file.name}`;

  // Upload the file to Cloudflare R2
  const fileUrl = await uploadFileToR2(fileKey, buffer, contentType);

  // Return both the URL and the key for future reference
  return NextResponse.json({ fileUrl, fileKey });
}

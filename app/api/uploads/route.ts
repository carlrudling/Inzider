import { NextResponse } from 'next/server';
import { uploadFileToR2 } from '@/lib/r2Helpers';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    console.log('Received upload request');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Processing file:', file.name, 'Type:', file.type);
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type;

    // Generate a unique key for the file
    const fileKey = `${randomUUID()}-${file.name}`;
    console.log('Generated file key:', fileKey);

    try {
      // Upload the file to Cloudflare R2
      console.log('Uploading to R2...');
      const fileUrl = await uploadFileToR2(fileKey, buffer, contentType);
      console.log('Upload successful, URL:', fileUrl);

      // Return both the URL and the key for future reference
      return NextResponse.json({ fileUrl, fileKey });
    } catch (error) {
      console.error('Error uploading to R2:', error);
      return NextResponse.json(
        { error: 'Failed to upload to storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing upload request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { uploadFileToR2 } from '@/lib/r2Helpers';

export async function POST(request: Request) {
  try {
    console.log('Received upload request');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    console.log(`Processing file: ${file.name} Type: ${file.type}`);

    // Generate a unique file key
    const fileKey = `${crypto.randomUUID()}-${file.name}`;
    console.log(`Generated file key: ${fileKey}`);

    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    console.log('Uploading to R2...');
    const fileUrl = await uploadFileToR2(fileKey, fileBuffer, file.type);

    return NextResponse.json({ fileUrl, key: fileKey });
  } catch (error: any) {
    console.error('Error processing upload request:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500 }
    );
  }
}

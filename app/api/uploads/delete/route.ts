import { NextResponse } from 'next/server';
import { deleteFileFromR2 } from '@/lib/r2Helpers';

export async function POST(req: Request) {
  try {
    const { key } = await req.json(); // Expecting the R2 file key from the frontend
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      );
    }

    // Call the helper function to delete the file from R2
    const result = await deleteFileFromR2(key);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

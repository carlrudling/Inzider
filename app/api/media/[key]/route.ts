import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  const resolvedParams = await Promise.resolve(params);
  const { key } = resolvedParams;

  try {
    const r2Url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    const response = await fetch(r2Url);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';

    const newResponse = new NextResponse(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

    return newResponse;
  } catch (error) {
    console.error('Error proxying media:', error);
    return new NextResponse('Error fetching media', { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import PackageAccess from '@/models/PackageAccess';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { packageId, packageType, email } = await req.json();

    if (!packageId || !packageType || !email) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await dbConnect();

    // Create a new access key
    const accessKey = await PackageAccess.create({
      packageId,
      packageType,
      email,
      userId: session.user.id,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    });

    // Send email with access key
    await resend.emails.send({
      from: 'Inzider <help.inzider@gmail.com>',
      to: email,
      subject: 'Your Inzider Access Key',
      html: `
        <h1>Welcome to Inzider!</h1>
        <p>Thank you for your purchase. Here's your access key:</p>
        <p><strong>${accessKey.key}</strong></p>
        <p>You can use this key to access your content at any time.</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating access key:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

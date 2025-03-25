import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PackageAccess from '@/models/PackageAccess';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Parse the request body
    const { email, accessKey, packageId } = await req.json();

    // Validate required fields
    if (!email || !accessKey || !packageId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify access using the PackageAccess model's static method
    const access = await PackageAccess.verifyAccess(
      email,
      accessKey,
      packageId
    );

    if (!access) {
      return NextResponse.json(
        { error: 'Invalid access key or expired access' },
        { status: 403 }
      );
    }

    // Return success with minimal access details
    return NextResponse.json({
      success: true,
      access: {
        packageId: access.packageId,
        packageType: access.packageType,
        expiresAt: access.expiresAt,
        lastAccessed: access.lastAccessed,
      },
    });
  } catch (error) {
    console.error('Access verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

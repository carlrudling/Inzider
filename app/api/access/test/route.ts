import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import PackageAccess from '@/models/PackageAccess';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Parse the request body
    const { email, packageId, packageType, creatorId } = await req.json();

    // Validate required fields
    if (!email || !packageId || !packageType || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a new access key
    const accessKey = await PackageAccess.generateUniqueKey();

    // Create new package access
    const access = await PackageAccess.create({
      email: email.toLowerCase(),
      accessKey,
      packageId,
      packageType,
      creatorId,
    });

    // Return the access key details
    return NextResponse.json({
      success: true,
      access: {
        email: access.email,
        accessKey: access.accessKey,
        packageId: access.packageId,
        packageType: access.packageType,
        expiresAt: access.expiresAt,
      },
    });
  } catch (error) {
    console.error('Test access creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

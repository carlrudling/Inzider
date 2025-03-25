import mongoose from 'mongoose';
import {
  IPackageAccessDocument,
  IPackageAccessModel,
} from '@/types/packageAccess';

const packageAccessSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'packageType',
    },
    packageType: {
      type: String,
      required: true,
      enum: ['GoTo', 'Trip'],
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year access
    },
    lastAccessed: {
      type: Date,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for quick lookups
packageAccessSchema.index({ email: 1, accessKey: 1 });
packageAccessSchema.index({ packageId: 1, isActive: 1 });
packageAccessSchema.index({ creatorId: 1, isActive: 1 });

// Method to check if access is valid
packageAccessSchema.methods.isValid = function (this: IPackageAccessDocument) {
  return this.isActive && (!this.expiresAt || this.expiresAt > new Date());
};

// Static method to verify access
packageAccessSchema.statics.verifyAccess = async function (
  email: string,
  accessKey: string,
  packageId: string
) {
  const access = await this.findOne({
    email: email.toLowerCase(),
    accessKey,
    packageId,
    isActive: true,
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
  });

  if (access) {
    // Update last accessed timestamp
    access.lastAccessed = new Date();
    await access.save();
  }

  return access;
};

// Static method to generate a unique access key
packageAccessSchema.statics.generateUniqueKey = async function () {
  const length = 16;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let accessKey;
  let isUnique = false;

  while (!isUnique) {
    accessKey = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    // Insert dashes every 4 characters for readability
    accessKey = accessKey.match(/.{1,4}/g)?.join('-') || accessKey;

    // Check if key already exists
    const exists = await this.findOne({ accessKey });
    if (!exists) {
      isUnique = true;
    }
  }

  return accessKey;
};

const PackageAccess = (mongoose.models.PackageAccess ||
  mongoose.model<IPackageAccessDocument, IPackageAccessModel>(
    'PackageAccess',
    packageAccessSchema
  )) as IPackageAccessModel;

export default PackageAccess;

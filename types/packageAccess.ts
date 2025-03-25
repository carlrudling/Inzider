import { Document, Model } from 'mongoose';

export interface IPackageAccess {
  packageId: string;
  packageType: 'GoTo' | 'Trip';
  accessKey: string;
  email: string;
  expiresAt?: Date;
  lastAccessed?: Date;
  purchasedAt: Date;
  isActive: boolean;
  creatorId: string;
}

export interface IPackageAccessDocument extends IPackageAccess, Document {
  isValid(): boolean;
}

export interface IPackageAccessModel extends Model<IPackageAccessDocument> {
  verifyAccess(
    email: string,
    accessKey: string,
    packageId: string
  ): Promise<IPackageAccessDocument | null>;
  generateUniqueKey(): Promise<string>;
}

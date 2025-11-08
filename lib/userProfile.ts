import { getDatabase } from './mongodb';

export interface UserProfile {
  userId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const db = await getDatabase();
  const profiles = db.collection<UserProfile>('user_profiles');

  return await profiles.findOne({ userId });
}

export async function createOrUpdateUserProfile(
  userId: string,
  email: string,
  fullName: string,
  phoneNumber: string
): Promise<void> {
  const db = await getDatabase();
  const profiles = db.collection<UserProfile>('user_profiles');

  await profiles.updateOne(
    { userId },
    {
      $set: {
        fullName,
        phoneNumber,
        email,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );
}

export async function hasUserProfile(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return !!profile && !!profile.fullName && !!profile.phoneNumber;
}

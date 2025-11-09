import { getDatabase } from './mongodb';

export interface DeviceSession {
  userId: string;
  deviceId: string;
  deviceName: string;
  userAgent: string;
  lastActive: Date;
  createdAt: Date;
}

export interface DeviceConflict {
  hasConflict: boolean;
  existingDevices?: DeviceSession[];
  deviceCount?: number;
}

const MAX_DEVICES = Number(process.env.MAX_DEVICES) || 3;

export async function checkDeviceLimit(userId: string, currentDeviceId: string): Promise<DeviceConflict> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  // total active sessions for user
  const totalCount = await sessions.countDocuments({ userId });

  // is current device already registered?
  const hasCurrent = await sessions.findOne({ userId, deviceId: currentDeviceId });

  // Find other devices (exclude current), newest first, limit for UI
  const existingDevices = await sessions
    .find({ userId, deviceId: { $ne: currentDeviceId } })
    .sort({ lastActive: -1 })
    .limit(MAX_DEVICES)
    .toArray();

  // If total sessions is already below limit -> no conflict
  if (totalCount < MAX_DEVICES) {
    return {
      hasConflict: false,
      existingDevices,
      deviceCount: totalCount
    };
  }

  // totalCount >= MAX_DEVICES
  // If current device is already one of the registered sessions -> allow (no conflict)
  if (hasCurrent) {
    return {
      hasConflict: false,
      existingDevices,
      deviceCount: totalCount
    };
  }

  // Otherwise adding current device would exceed limit -> conflict
  return {
    hasConflict: true,
    existingDevices,
    deviceCount: totalCount
  };
}

export async function addDeviceSession(
  userId: string,
  deviceId: string,
  userAgent: string
): Promise<void> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  const deviceName = getDeviceName(userAgent);

  await sessions.updateOne(
    { userId, deviceId },
    {
      $set: {
        userId,
        deviceId,
        deviceName,
        userAgent,
        lastActive: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );
}

export async function removeDeviceSession(userId: string, deviceId: string): Promise<void> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  await sessions.deleteOne({ userId, deviceId });
}

export async function updateLastActive(userId: string, deviceId: string): Promise<void> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  await sessions.updateOne(
    { userId, deviceId },
    { $set: { lastActive: new Date() } }
  );
}

export async function getUserDevices(userId: string): Promise<DeviceSession[]> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  return await sessions
    .find({ userId })
    .sort({ lastActive: -1 })
    .toArray();
}

export async function isDeviceActive(userId: string, deviceId: string): Promise<boolean> {
  const db = await getDatabase();
  const sessions = db.collection<DeviceSession>('device_sessions');

  const session = await sessions.findOne({ userId, deviceId });
  return !!session;
}

function getDeviceName(userAgent: string): string {
  const ua = (userAgent || '').toLowerCase();

  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    if (ua.includes('iphone')) return 'iPhone';
    if (ua.includes('ipad')) return 'iPad';
    if (ua.includes('android')) return 'Android Device';
    return 'Mobile Device';
  }

  if (ua.includes('mac')) return 'Mac';
  if (ua.includes('windows')) return 'Windows PC';
  if (ua.includes('linux')) return 'Linux PC';

  return 'Unknown Device';
}
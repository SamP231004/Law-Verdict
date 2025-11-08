import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { checkDeviceLimit, isDeviceActive } from '@/lib/deviceManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.sub;
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }

    const isActive = await isDeviceActive(userId, deviceId);

    if (!isActive) {
      return res.json({ isActive: false, forceLogout: true });
    }

    const conflict = await checkDeviceLimit(userId, deviceId);

    return res.json({
      isActive: true,
      hasConflict: conflict.hasConflict,
      existingDevices: conflict.existingDevices,
      deviceCount: conflict.deviceCount,
    });
  } catch (error) {
    console.error('Device check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

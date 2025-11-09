import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { removeDeviceSession } from '@/lib/deviceManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    await removeDeviceSession(userId, deviceId);
    return res.json({ success: true });
  }
  catch (error) {
    console.error('Device removal error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
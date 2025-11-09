import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { addDeviceSession } from '@/lib/deviceManager';

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
    const userAgent = req.headers['user-agent'] || 'Unknown';
    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID required' });
    }

    await addDeviceSession(userId, deviceId, userAgent);

    res.setHeader(
      'Set-Cookie',
      `deviceId=${deviceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
    );

    return res.json({ success: true });
  }
  catch (error) {
    console.error('Device registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
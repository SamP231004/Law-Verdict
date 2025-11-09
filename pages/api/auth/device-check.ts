import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { checkDeviceLimit } from '@/lib/deviceManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return res.redirect('/');
    }

    const userId = session.user.sub;
    const deviceId = req.cookies.deviceId || '';
    
    const conflict = await checkDeviceLimit(userId, deviceId);
    if (conflict.hasConflict) {
      return res.redirect('/device-conflict');
    }
    return res.redirect('/profile-setup');
  } 
  catch (error) {
    console.error('Device check error:', error);
    return res.redirect('/');
  }
}
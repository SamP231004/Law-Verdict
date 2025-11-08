import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { createOrUpdateUserProfile, getUserProfile } from '@/lib/userProfile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = session.user.sub;

    if (req.method === 'GET') {
      const profile = await getUserProfile(userId);
      return res.json({ profile });
    }

    if (req.method === 'POST') {
      const { fullName, phoneNumber } = req.body;

      if (!fullName || !phoneNumber) {
        return res.status(400).json({ error: 'Full name and phone number required' });
      }

      await createOrUpdateUserProfile(
        userId,
        session.user.email || '',
        fullName,
        phoneNumber
      );

      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Profile setup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await connectToDatabase();
		return res.status(200).json({ ok: true, message: 'Connected to MongoDB' });
	}
	catch (err: any) {
		return res.status(500).json({ ok: false, message: err?.message ?? 'Connection failed' });
	}
}
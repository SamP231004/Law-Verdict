import { MongoClient, Db } from 'mongodb';

function getMongoUri(): string {
	if (typeof window !== 'undefined') {
		throw new Error('MongoDB operations are not available in the browser');
	}

	const rawUri = process.env.MONGODB_URI;
	const uri = rawUri ? rawUri.replace(/^"(.*)"$/, '$1') : undefined;

	if (!uri) {
		throw new Error('Please add your MongoDB URI to .env');
	}
	return uri;
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
	const uri = getMongoUri();

	if (cachedClient) {
		return { client: cachedClient, db: cachedClient.db() };
	}
	const client = new MongoClient(uri);
	await client.connect();
	cachedClient = client;
	return { client, db: client.db() };
}

export async function getDatabase(): Promise<Db> {
	const { db } = await connectToDatabase();
	return db;
}
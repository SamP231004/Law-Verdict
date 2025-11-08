import { MongoClient, Db } from 'mongodb';

// Move env access into a server-side helper to avoid throwing during client-side imports.
function getMongoUri(): string {
	// If this module is accidentally imported in the browser, avoid reading process.env at import time.
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

// Simple client caching to avoid exhausting connections during hot reloads in dev
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
	// Validate and obtain URI at call time (server-side)
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

import mongoose from 'mongoose';

mongoose.connection.on('connected', async () => {
    console.log("[Database] Successfully connected !");
});

mongoose.connection.on('error', () =>
    console.error('[Database] Failed to connect on the database.')
);

export const connectDb = async(MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_URL) => {
    let mongoURI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URL}:27017`;
    console.log('[Database] Connecting to database..');
    await mongoose.connect(mongoURI, {dbName: "backend"});
}
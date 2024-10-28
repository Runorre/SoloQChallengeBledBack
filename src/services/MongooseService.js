import mongoose from 'mongoose';

let mongoURI = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:27017`;

mongoose.connection.on('connected', async () => {
    console.log("[Database] Successfully connected !");
});

mongoose.connection.on('error', () =>
    console.error('[Database] Failed to connect on the database.')
);

export const connectDb = async() => {
    console.log('[Database] Connecting to database..');
    await mongoose.connect(mongoURI, {dbName: "backend"});
}
import mongoose from 'mongoose';
import {UserModel} from '../models/index.js';
import bycrypt from 'bcrypt';

let mongoURI = `mongodb://127.0.0.1:27017`;

mongoose.connection.on('connected', async () => {
    console.log("[Database] Successfully connected !");
    //creé moi un user par defaut admin si il n'existe pas
    // const defaultAdmin = await UserModel.findOne({"email.address" : "admin@room.fr"});
    // if (!defaultAdmin) {
    //     const hashedPassword = await bycrypt.hash("Admin2024", 10);
    //     const admin = new UserModel({
    //         name: {
    //             first: "admin",
    //             last: "admin"
    //         },
    //         email: {
    //             address: "admin@room.fr"
    //         },
    //         password: hashedPassword,
    //         role: "ADMIN",
    //     });
    //     await admin.save();
    // }
});

mongoose.connection.on('error', () =>
    console.error('[Database] Failed to connect on the database.')
);

export const connectDb = async() => {
    console.log('[Database] Connecting to database..');
    await mongoose.connect(mongoURI, {dbName: "backend"});
}
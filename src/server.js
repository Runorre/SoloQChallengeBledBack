import http from 'http';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import { connectDb } from './services/MongooseService.js';
import router from './routes/index.js';
import bodyParser from 'body-parser';

(async () => {
    const app = express();

    app.disable('X-Powered-By');
    app.use(express.json());
    app.use(bodyParser.json({ type: 'application/*+json' }))
    app.use('/api', router);

    const server = http.createServer(app);

    server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    })

    await connectDb();
})();
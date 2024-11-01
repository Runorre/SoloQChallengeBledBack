import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import cors from 'cors';
import https from 'https';

dotenv.config();

import { connectDb } from './services/MongooseService.js';
import router from './routes/index.js';
import bodyParser from 'body-parser';
import refreshPlayer from './services/Event/PlayerRefresh.js';
import refreshTeam from './services/Event/TeamRefresh.js';
import resetPlayer from './services/Event/ResetPlayer.js';

const httpsOptions = {
    key: fs.readFileSync(PATH_KEY_HTTPS),
    cert: fs.readFileSync(PATH_CERF_HTTPS)
};


(async () => {
    const app = express();

    app.disable('X-Powered-By');
    app.use(express.json());
    app.use(bodyParser.json({ type: 'application/*+json' }))

    app.use(cors());

    app.use('/api', router);

    const server = http.createServer(app);

    const securedServer = https.createServer(httpsOptions, app);

    server.listen(process.env.PORT_HTTP, () => {
        console.log(`HTTP Port : ${process.env.PORT_HTTP}`);
    })

    securedServer.listen(process.env.PORT_HTTPS, () => {
        console.log(`HTTPS Port : ${process.env.PORT_HTTPS}`);
    });
    

    await connectDb();

    //Time Event
    
    // Exécuter refreshPlayer et refreshTeam toutes les minutes
    cron.schedule('* * * * *', async () => {
        await refreshPlayer();
        await refreshTeam();
    });
    
    // Planifier resetPlayer pour s'exécuter tous les dimanches à 23h42
    cron.schedule('42 23 * * 0', async () => {
        await resetPlayer();
    });
})();
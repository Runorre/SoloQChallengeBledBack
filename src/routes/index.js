import express from 'express';
import PlayerRouter from './PlayerRoutes';

// import { bearerTokenHandler, userRoleHandler } from '../services/middlewares/UserMiddleware.js';

const router = express.Router();

router.use('/players', PlayerRouter);

export default router;
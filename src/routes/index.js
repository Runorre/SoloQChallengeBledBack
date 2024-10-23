import express from 'express';
import PlayerRouter from './PlayerRoutes.js';
import TeamRouter from './TeamRoutes.js';

// import { bearerTokenHandler, userRoleHandler } from '../services/middlewares/UserMiddleware.js';

const router = express.Router();

router.use('/players', PlayerRouter);
router.use('/teams', TeamRouter);

export default router;
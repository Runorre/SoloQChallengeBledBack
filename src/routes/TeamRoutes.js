import express from 'express';
import { TeamController } from '../controllers/index.js';

const TeamRouter = express.Router();

TeamRouter.post('/', TeamController.createTeam);
TeamRouter.post('/add-player', TeamController.addPlayerOnTeam);
TeamRouter.get("/", TeamController.getTeams);
TeamRouter.get("/refresh", TeamController.refreshTeamData);

export default TeamRouter;
import express from 'express';
import { PlayerController } from '../controllers';

const PlayerRouter = express.Router();

PlayerRouter.post('/', PlayerController.addPlayer);
PlayerRouter.get('/', PlayerController.getPlayers);
PlayerRouter.get('/:id', PlayerController.getPlayer);
PlayerRouter.put('/:id', PlayerController.updatePlayer);
PlayerRouter.delete('/:id', PlayerController.deletePlayer);
PlayerRouter.get('/refresh', PlayerController.refreshData);

export default PlayerRouter;
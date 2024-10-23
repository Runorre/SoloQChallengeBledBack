import { PlayerModel } from "../../models/index.js";

async function resetPlayer() {
    try {
        const players = await PlayerModel.find();
        if (!players) {
            return 84;
        }

        for (const player of players) {
            player.numberOfGames = 0;
            await player.save();
        }

        return 0;
    } catch (error) {
        console.error("resetPlayerData", error);
        return 84;
    }
}

export default resetPlayer;
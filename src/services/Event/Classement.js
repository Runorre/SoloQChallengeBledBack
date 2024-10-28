const Rank = {
    IRON: 0,
    BRONZE: 400,
    SILVER: 800,
    GOLD: 1200,
    PLATINUM: 1600,
    EMERALD: 2000,
    DIAMOND: 2400,
    MASTER: 2800,
    GRANDMASTER: 2801,
    CHALLENGER: 2802
};

const Tier = {
    "IV" : 0,
    "III" : 100,
    "II" : 200,
    "I" : 300
};


async function refreshClassement(players) {
    try {
        if (!players) {
            return 84;
        }

        players.sort((a, b) => b.LPTotal - a.LPTotal);

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            const rank = i + 1;
            player.classement = rank;
            await player.save();
        }

        return 0;
    } catch (error) {
        console.error("refreshClassementData", error);
        return 84;
    }
}

export default refreshClassement;
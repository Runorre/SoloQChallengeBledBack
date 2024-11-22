import axios from "axios";
import { PlayerModel } from "../../models/index.js"; // Assurez-vous que PlayerModel est exporté depuis models/index.js
import refreshClassement from "./Classement.js";

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


async function refreshPlayer() {
    try {
        const players = await PlayerModel.find();
        if (!players) {
            return 84;
        }

        for (let i = 0; i < players.length; i++) {
            const player = players[i];
        
            const summonerData = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${player.puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            });
            const rankedData = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.summonerId}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            });

            player.profileIconId = summonerData.data.profileIconId;
        
            if (rankedData.data.length !== 0) {
                let rankedSoloData = null;
            
                if (rankedData.data.length === 2) {
                    rankedSoloData = rankedData.data.find(entry => entry.queueType === 'RANKED_SOLO_5x5');
                } else if (rankedData.data.length === 1 && rankedData.data[0].queueType === 'RANKED_SOLO_5x5') {
                    rankedSoloData = rankedData.data[0];
                }
            
                if (rankedSoloData) {
                    if (player.rankActually !== rankedSoloData.rank || player.divisionActually !== rankedSoloData.tier || player.LPActually !== rankedSoloData.leaguePoints) {
                        player.numberOfGames++;
                        player.totalOfNbrOfGames++;
                        // if (player.numberOfGames > 21) {
                        //     player.penality += 1;
                        // }
                    }
            
                    player.divisionActually = rankedSoloData.tier;
                    player.rankActually = rankedSoloData.rank;
                    player.LPActually = rankedSoloData.leaguePoints;
            
                    if (player.divisionActually !== "UNRANKED") {
                        if (Rank[player.divisionActually] > Rank[player.divisionPeak]) {
                            player.rankPeak = player.rankActually;
                            player.divisionPeak = player.divisionActually;
                            player.LPPeak = player.LPActually;
                        } else if (Rank[player.divisionActually] === Rank[player.divisionPeak]) {
                            if (Tier[player.rankActually] > Tier[player.rankPeak]) {
                                player.rankPeak = player.rankActually;
                                player.LPPeak = player.LPActually;
                            } else if (Tier[player.rankActually] === Tier[player.rankPeak]) {
                                if (player.LPActually > player.LPPeak) {
                                    player.LPPeak = player.LPActually;
                                }
                            }
                        }
                        if (player.divisionActually === "MASTER" || player.divisionActually === "GRANDMASTER" || player.divisionActually === "CHALLENGER") {
                            player.LPTotal = Rank[player.divisionActually] + player.LPActually;
                        } else {
                            player.LPTotal = Rank[player.divisionActually] + Tier[player.rankActually] + player.LPActually;
                        }
                    } else {
                        player.LPTotal = 0;
                    }
                } else {
                    player.divisionActually = "UNRANKED";
                    player.rankActually = "IV";
                    player.LPActually = 0;
                    player.LPTotal = 0;
                }
            }
            await player.save();
            if ((i + 1) % 7 === 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            // player.OTP = [];
            // for (const OTP of OTPData.data) {
            //     player.OTP.push(OTP.championId);
            // }
        }
        refreshClassement(players);
        return 0;
    } catch (error) {
        console.error("refreshData", error);
        return 84;
    }
}

export default refreshPlayer;
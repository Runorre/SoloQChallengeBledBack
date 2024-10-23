import axios from "axios";
import { PlayerModel } from "../../models/index.js"; // Assurez-vous que PlayerModel est exporté depuis models/index.js

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

        for (const player of players) {
            const summonerData = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${player.puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            });
            const rankedData = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${player.summonerId}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            })
            const OTPData = await axios.get(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${player.puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            })

            player.summonerId = summonerData.data.id;
            player.profileIconId = summonerData.data.profileIconId;

            if (player.rankActually != rankedData.data[0].rank || player.divisionActually != rankedData.data[0].tier || player.LPActually != rankedData.data[0].leaguePoints) {
                player.numberOfGames++;
                if (player.numberOfGames > 21) {
                    player.penality += 1;
                }
            }

            player.divisionActually = rankedData.data[0].tier;
            player.rankActually = rankedData.data[0].rank;
            player.LPActually = rankedData.data[0].leaguePoints;

            if (player.divisionActually != "UNRANKED") {
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
            }

            player.OTP = [];
            for (const OTP of OTPData.data) {
                player.OTP.push(OTP.championId);
            }
            await player.save();
        }
        return 0;
    } catch (error) {
        console.error("refreshData", error);
        return 84;
    }
}

export default refreshPlayer;
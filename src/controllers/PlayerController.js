import axios from "axios";
import { PlayerModel, TeamModel } from "../models/index.js";

const Tier = {
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

const Rank = {
    "IV" : 0,
    "III" : 100,
    "II" : 200,
    "I" : 300
};

export default {
    addPlayer: async (req, res) => {
        try {
            const {gameName, tagLine, nameOfPlayer, teamId} = req.body;
            if (!gameName || !tagLine || !nameOfPlayer) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const playerData = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            });
            if (!playerData) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }
            const puuid = playerData.data.puuid;
            const summonerData = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            })

            const player = new PlayerModel({
                name: nameOfPlayer,
                summonerName: `${gameName}#${tagLine}`,
                puuid: summonerData.data.puuid,
                summonerId: summonerData.data.id,
                profileIconId: summonerData.data.profileIconId
            });
            await player.save();

            if (teamId) {
                const team = await TeamModel.findById(teamId);
                team.members.push(player._id);
                player.team = team._id;
                await team.save();
            }

            await player.save();

            return res.status(201).json({
                success: true,
                message: 'Player added successfully',
                playerId : player._id
            });

        } catch (error) {
            console.error("addPlayer", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    getPlayers: async (req, res) => {
        try {
            const players = await PlayerModel.find().select({
                name: 1,
                classement: 1,
                summonerName: 1,
                rankActually: 1,
                divisionActually : 1,
                LPActually: 1,
                rankPeak: 1,
                divisionPeak : 1,
                LPPeak: 1,
                profileIconId: 1,
                totalOfNbrOfGames: 1,
                numberOfGames : 1,
                penality : 1,
                _id : 1, team : 1})
                .sort({classement: 1}).populate('team');
            if (!players) {
                return res.status(404).json({
                    success: false,
                    message: 'No players found'
                });
            }
            return res.status(200).json({
                success: true,
                players
            });
        } catch (error) {
            console.error("getPlayers", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    getPlayer : async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const player = await PlayerModel.findById(id);
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }

            return res.status(200).json({
                success: true,
                player
            });
        } catch (error) {
            console.error("getPlayer", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    updatePlayer: async (req, res) => {
        try {
            const {id} = req.params;
            const {gameName, tagLine, nameOfPlayer} = req.body;
            if (!gameName || !tagLine || !nameOfPlayer) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const player = await PlayerModel.findById(id);

            const playerData = await axios.get(`https://euw1.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            });
            if (!playerData) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }

            const puuid = playerData.puuid;
            const summonerData = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
                headers: {
                    'X-Riot-Token': process.env.RIOT_API_KEY
                }
            })

            player.name = nameOfPlayer;
            player.summonerName = summonerData.name;
            player.puuid = summonerData.puuid;
            player.summonerId = summonerData.id;
            player.tier = '0';
            player.rank = 'Unranked';
            player.LP = 0;
            player.profileIconId = summonerData.profileIconId;
            await player.save();

            return res.status(201).json({
                success: true,
                message: 'Player added successfully'
            });
        } catch (error) {
            console.error("updatePlayer", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    deletePlayer: async (req, res) => {
        try {
            const {id} = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const player = await PlayerModel.findById(id);
            if (!player) {
                return res.status(404).json({
                    success: false,
                    message: 'Player not found'
                });
            }

            await player.delete();

            return res.status(200).json({
                success: true,
                message: 'Player deleted successfully'
            });
        } catch (error) {
            console.error("deletePlayer", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    refreshData: async (req, res) => {
        try {
            const players = await PlayerModel.find();
            if (!players) {
                return res.status(404).json({
                    success: false,
                    message: 'No players found'
                });
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

                if (player.rankActually != "UNRANKED") {
                    if (Rank[player.rankActually] > Rank[player.rankPeak]) {
                        player.rankPeak = player.rankActually;
                        player.divisionPeak = player.divisionActually;
                        player.LPPeak = player.LPActually;
                    } else if (Rank[player.rankActually] === Rank[player.rankPeak]) {
                        if (Tier[player.divisionActually] > Tier[player.divisionPeak]) {
                            player.divisionPeak = player.divisionActually;
                            player.LPPeak = player.LPActually;
                        } else if (Tier[player.divisionActually] === Tier[player.divisionPeak]) {
                            if (player.LPActually > player.LPPeak) {
                                player.LPPeak = player.LPActually;
                            }
                        }
                    }
                }

                player.OTP = [];
                for (const OTP of OTPData) {
                    player.OTP.push(OTP.championId);
                }
                await player.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Data refreshed successfully'
            });
        } catch (error) {
            console.error("refreshData", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
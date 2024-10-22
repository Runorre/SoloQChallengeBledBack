import axios from "axios";
import { PlayerModel } from "../models";

export default {
    addPlayer: async (req, res) => {
        try {
            const {gameName, tagLine, nameOfPlayer} = req.body;
            if (!gameName || !tagLine || !nameOfPlayer) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

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

            const player = new PlayerModel({
                name: nameOfPlayer,
                summonerName: summonerData.name,
                puuid: summonerData.puuid,
                summonerId: summonerData.id,
                tier: '0',
                rank: 'Unranked',
                LP: 0,
                profileIconId: summonerData.profileIconId
            });
            await player.save();

            return res.status(201).json({
                success: true,
                message: 'Player added successfully'
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
            const players = await PlayerModel.find().select({name: 1, summonerName: 1, rank: 1, tier : 1, LP: 1, profileIconId: 1, _id : 1});
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

                player.summonerName = summonerData.name;
                player.summonerId = summonerData.id;
                player.profileIconId = summonerData.profileIconId;
                player.tier = rankedData.tier;
                player.rank = rankedData.rank;
                player.LP = rankedData.leaguePoints;
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
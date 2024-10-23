import { TeamModel } from "../models/index.js";

const Rank = {
    IRON: 0,
    BRONZE: 400,
    SILVER: 800,
    GOLD: 1200,
    PLATINUM: 1600,
    EMERALD: 2000,
    DIAMOND: 2400,
    MASTER: 2800,
    GRANDMASTER: 2800,
    CHALLENGER: 2800
};

const Tier = {
    "IV" : 0,
    "III" : 100,
    "II" : 200,
    "I" : 300
};

export default {
    createTeam : async (req, res) => {
        try {
            const {teamName} = req.body;
            if (!teamName) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const team = new TeamModel({
                TeamName : teamName
            });

            await team.save();

            return res.status(201).json({
                success: true,
                message: 'Team created successfully'
            });
        } catch (error) {
            console.error("createTeam", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    addPlayerOnTeam : async (req, res) => {
        try {
            const {teamId, playerId} = req.body;
            if (!teamId || !playerId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            const team = await TeamModel.findById(teamId);
            if (!team) {
                return res.status(404).json({
                    success: false,
                    message: 'Team not found'
                });
            }

            team.members.push(playerId);
            await team.save();

            return res.status(200).json({
                success: true,
                message: 'Player added on team successfully'
            });
        } catch (error) {
            console.error("addPlayerOnTeam", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    refreshTeamData: async (req, res) => {
        try {
            const teams = await TeamModel.find().populate('members');
            if (!teams) {
                return res.status(404).json({
                    success: false,
                    message: 'No teams found'
                });
            }

            for (const team of teams) {
                let LPTotal = 0;
                for (const member of team.members) {
                    if (!member) {
                        continue;
                    }
                    let LP = 0;
                    let penalityLP = 0;

                    if (member.rankActually === "UNRANKED")
                        LP = 0;
                    else if (member.rankActually != "GRANDMASTER" && member.rankActually != "MASTER" && member.rankActually != "CHALLENGER")
                        LP = Rank[member.rankActually] + Tier[member.divisionActually] + member.LPActually;
                    else
                        LP = Rank[member.rankActually] + member.LPActually;
                    penalityLP = (member.penality * 25);
                    LPTotal += (LP - penalityLP);
                }
                team.LPTotal = LPTotal;
                await team.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Teams updated successfully'
            });
        } catch (error) {
            console.error("refreshTeamData", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
    getTeams : async (req, res) => {
        try {
            const teams = await TeamModel.find().populate('members');
            if (!teams) {
                return res.status(404).json({
                    success: false,
                    message: 'No teams found'
                });
            }
            return res.status(200).json({
                success: true,
                teams
            });
        } catch (error) {
            console.error("getTeams", error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },
}
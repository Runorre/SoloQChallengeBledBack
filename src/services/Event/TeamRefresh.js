import { TeamModel } from "../../models/index.js";

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

async function refreshTeam() {
    try {
        const teams = await TeamModel.find().populate('members');
        if (!teams) {
            return 84;
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
                    LP = Rank[member.divisionActually] + Tier[member.rankActually] + member.LPActually;
                else
                    LP = Rank[member.rankActually] + member.LPActually;
                penalityLP = (member.penality * 25);
                LPTotal += (LP - penalityLP);
            }
            team.LPTotal = LPTotal;
            await team.save();
        }

        return 0;
    } catch (error) {
        console.error("refreshTeamData", error);
        return 84;
    }
}

export default refreshTeam;
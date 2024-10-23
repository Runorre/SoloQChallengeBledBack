import { Schema, Types, model } from 'mongoose';

export const PlayerModel = new Schema({
    name: {
        type: String,
        required: true
    },
    summonerName : {
        type: String,
        required: true
    },
    puuid : {
        type: String,
        required: true
    },
    summonerId : {
        type: String,
        required: true
    },
    divisionPeak : {
        type: String,
        default : "IRON"
    },
    rankPeak : {
        type: String,
        default : "IV"
    },
    LPPeak : {
        type: Number,
        default : 0
    },
    divisionActually : {
        type: String,
        default : "IRON"
    },
    rankActually : {
        type: String,
        default : "IV"
    },
    LPActually : {
        type: Number,
        default : 0
    },
    profileIconId : {
        type: String,
        required: true
    },
    OTP: {
        type: [String],
        default: []
    },
    numberOfGames: {
        type: Number,
        default: 0
    },
    penality : {
        type: Number,
        default : 0
    }
});

const Player = model('Player', PlayerModel);

export default Player;
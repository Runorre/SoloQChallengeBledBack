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
        default : "IV"
    },
    rankPeak : {
        type: String,
        default : "Iron"
    },
    LPPeak : {
        type: Number,
        default : 0
    },
    divisionActually : {
        type: String,
        default : "IV"
    },
    rankActually : {
        type: String,
        default : "Iron"
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
    }
});

const Player = model('Player', PlayerModel);

export default Player;
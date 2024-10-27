import { Schema, Types, model } from 'mongoose';

export const PlayerModel = new Schema({
    classement: {
        type: Number,
        required: true,
        default: 0
    },
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
        default : "UNRANKED"
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
        default : "UNRANKED"
    },
    rankActually : {
        type: String,
        default : "IV"
    },
    LPActually : {
        type: Number,
        default : 0
    },
    LPTotal : {
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
    totalOfNbrOfGames: {
        type: Number,
        default: 0
    },
    numberOfGames: {
        type: Number,
        default: 0
    },
    penality : {
        type: Number,
        default : 0
    },
    team : {
        type: Types.ObjectId,
        ref: 'Team'
    }
});

const Player = model('Player', PlayerModel);

export default Player;
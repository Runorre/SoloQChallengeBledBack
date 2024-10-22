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
    division : {
        type: String,
        required: true
    },
    rank : {
        type: String,
        required: true
    },
    LP : {
        type: Number,
        required: true
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
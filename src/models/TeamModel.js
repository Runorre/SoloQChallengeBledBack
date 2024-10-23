import { Schema, Types, model } from 'mongoose';

export const TeamModel = new Schema({
    TeamName : {
        type : String,
        required : true
    },
    members : {
        type : [{
            type: Schema.Types.ObjectId,
            ref: 'Player'
        }],
        default : []
    },
    LPTotal : {
        type : Number,
        default : 0
    }
})

const Team = model('Team', TeamModel);

export default Team;
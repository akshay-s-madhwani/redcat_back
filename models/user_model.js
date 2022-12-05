const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    pushname:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    formatted_number:{
        type:String,
        required:true
    },
    profile_picture:{
        type:String,
        required:false
    },
    cart:[
    {
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        
        }],
    score:{
        type:Number
    },
    isVerified:{type:Boolean},
    hasAddress:{type:Boolean},
    address:{
        text:{type:String},
        house:{type:String},
        street:{type:String},
        building:{type:String},
        city:{type:String},
    },
    location:{
        longitude:{type:String},
        latitude:{type:String},
    },
    date: {
        type: Date,
        default: Date.now
    }

} )


module.exports = mongoose.model('user', userSchema);
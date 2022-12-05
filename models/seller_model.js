const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = Schema({
    pushname:{
        type:String
        
    },
    seller_id:{
        type:String,
        required:true
    },
    shop_name : {
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
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
    },
    verified:{type:Boolean},
    emailVerified:{type:Boolean},
    category:[
    {type:String}
    ],
    currency:{
        type:String
    },
    address:{
        text:{type:String},
        house:{type:String},
        building:{type:String},
        street:{type:String},
        city:{type:String}
    },
    payout_destination:{
        type:String,
        enum:['bank','card'],
        
    },
    payout_details:{
        
    },
    products_uploaded:[
    {
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
    }],
    created_on: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model('seller', sellerSchema );
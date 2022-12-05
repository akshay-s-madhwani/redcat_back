const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('../connection');

const orderSchema = Schema({
    
    products:[{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            quantity:{
                type:Number
            },
            properties:{
                type:[]
            }
    }],
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'seller'
    },
    multi_seller:[{
        product:{type:mongoose.Schema.Types.ObjectId,
            ref:'products'},
            soldBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'seller'
            },
            quantity:{type:Number}
    }],
    ordered_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    gross_price:{
        type:Number,
        required:true
    },
    vat:{
        type:Number
    },
    discount:{
        type:Number
    },
    extra_charges:{
        type:Number
    },
    net_price:{
        type:Number
    },
    payment_status:{
        type:String,
        enum:['waiting' , 'payment_made' , 'confirmed'],
        default:'waiting'
    },
    delivery_status:{
        type:String,
        enum:['order_placed','en-route','delivered','confirmed_delivery'],
        default:'order_placed'
    },
    order_status:{
        type:String,
        enum:['active','completed','canceled'],
        default:'active'
    },
    delivery_duration:{
        type:Number
    },
    payment_referral_id:{
        type:String
    },
    created_on: {
        type: Date,
        default: Date.now
    }

})

orderSchema.plugin(AutoIncrement, {inc_field: 'invoice_number'});
module.exports = mongoose.model('order', orderSchema );
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = Schema({
    coupon_discount:{
        type:Number,
        required:true
    }
    coupon_id:{
        type:String,
        required:true
    },
    added_by:{
        type:String,
        defualt:'Admin'
    },
    date: {
        type: Date,
        default: Date.now
    }

})

const coupons = mongoose.model('coupons', couponSchema);
module.exports = coupons
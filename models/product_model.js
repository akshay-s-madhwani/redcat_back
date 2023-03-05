const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('../connection');
const short_id = require('shortid');
const productSchema = Schema({
    public_id:{
        type:String
    },
    category:{
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required : true
    },
    originalPrice:{
        type:Number
    },
    image:{
        type:String
    },
    imageData:{
        type:String
    },
    hasImage:{
        type:Boolean
    },
    description:{
        type:String,
        required:true
    },
    potentialPurchase:[{
    	name:{type:String},
    	number:{type:Number},
    	Type:{
    	type:String,
    	enum:['direct','In-Cart'	]
    	},
    	on:{
    		type:Date,
    		}
    }],
    
    currency:{
        type:String,
        required:true
    },
    stock:{
    	type:Number
    },
    status:{
       type:String,
       enum:['private','sent for verification' , 'public'],
       default:'private'
    },
    properties:{
        type:[]
    },
    seller_details:{
    	type:mongoose.Schema.Types.ObjectId,
        ref:'seller'
    },
    coupon_added:{
    	type:mongoose.Schema.Types.ObjectId,
        ref:'coupons',
        check:{
                type:Boolean,
                default:false
        }	
    },
    addedBy:{
    	type:String,
    },
    rating:{
        rate:{type:Number},
        count:{type:Number}
    },
    reviews:[
    {
    	id:{type:String},
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        user_name:{type:String},
        content:{
            type:String
        },
        rating:{
          type:Number
        }
    }
    ],
    date: {
        type: Date,
        default: Date.now
    }

})
productSchema.plugin(AutoIncrement, {inc_field: 'product_id'});
module.exports = mongoose.model('products', productSchema);

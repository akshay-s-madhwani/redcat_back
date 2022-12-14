const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = Schema({
    name:{
        type:String,
        required:true
    },
    category_id:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    sub_categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    }],
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    }], 
} )


module.exports = mongoose.model('category', categorySchema);
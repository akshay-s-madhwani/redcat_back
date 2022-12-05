const mongoose = require('mongoose');

const autoIncrement = require('mongoose-sequence')


// if(process.argv.length < 3){throw 'Product.json file required'}

mongoose
.connect('mongodb://127.0.0.1:27017/what_store')
.then(res=>console.log('Mongo DB connected to What_store'))
.catch(e=>console.log(e))

let AutoIncrement = autoIncrement(mongoose);

module.exports = mongoose
module.exports = AutoIncrement
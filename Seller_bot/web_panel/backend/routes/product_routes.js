const express = require('express')
const router = express.Router();


const add_products = require('../controller/create_product.controller.js')
const all_products = require('../controller/get_products.controller.js')
const get_product = require('../controller/get_product.controller.js')
const delete_product = require('../controller/delete_product.controller.js')



router.post('/add_product' , add_products)
router.get('/products', all_products)
router.get('/get_product/:id'  , get_product)
router.delete('/product/:id' , delete_product )


module.exports = router
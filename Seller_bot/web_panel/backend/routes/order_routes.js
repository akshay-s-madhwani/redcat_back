const express = require('express')
const router = express.Router();


const add_orders = require('../controller/create_order.controller')
const all_orders = require('../controller/get_orders.controller.js')
const get_order = require('../controller/get_order.controller.js')
const cancel_order = require('../controller/cancel_order.controller')
const update_order = require('../controller/update_oder_status')



router.post('/add_order' , add_orders)
router.get('/orders/:seller_id/:limit/:offset', all_orders)
router.get('/get_order/:id/:limit/:offset'  , get_order)
router.delete('/cancel_order/:id' , cancel_order )
router.put('/order/:invoice_number/:delivery/:payment/:order' , update_order)


module.exports = router
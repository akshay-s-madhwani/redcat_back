let uuid = require('uuid')
let orderSchema = require('../../../../models/order_models.js');


// @Method POST
// @data : 
// --- Order [Obect Order] 
// --- keys => products  products , seller , ordered_by , coupon_code , gross_price , vat , discount , extra_charges , net_price , delivery_duration  
// --- Products => [product : { id , quantity  }]

module.exports = async (req, res) => {
    let { order } = await req.body;
    let { products , seller , ordered_by , coupon_code , gross_price , vat , discount , extra_charges , net_price , delivery_duration } = order;
    
    if (isNaN(gross_price) || isNaN(net_price) ){
    	return res.status(400).json({message:"Invalid Data, Prices amount should be Digits without any symbols"})
    }
    if(!products.length){
    	return res.status(400).json({message:"Products not found"});
    }
    if(!seller){
    	return res.status(400).json({message:"Seller Id is required"});
    }
    if(!ordered_by){
    	return res.status(400).json({message:"customer Id is Required"});
    }
    // for(let i of products){
    //     let { price , title , quantity , category} = i;
    //     if (isNaN(price) || isNaN(originalPrice) || isNaN(stock)){
    //     return res.status(400).json({message:"Invalid Data, Price and Stock amount should be Digits without any symbols"})
    // }
    

    let new_order = new orderSchema({
        products , seller , ordered_by , coupon_code , gross_price , vat , discount , extra_charges , net_price , delivery_duration
    });

    await new_order.save()
        .then(order => {
            return res.json({ new_order });
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({ message: "Error occured while saving order" });
        })

}
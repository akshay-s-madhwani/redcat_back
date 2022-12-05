let orderSchema = require('../../../../models/order_models.js');


// @Method PUT
// @data : [Object order]
//@access : Private

module.exports = async (req, res) => {
    const redis = req.app.get('redis')
    let { invoice_number , delivery , payment , order } = req.params;
    if(!invoice_number){
        return res.status(404).json({message:"order not found"})
    }
    // try{
    let delivery_enum = ['order_placed','en-route','delivered','confirmed_delivery'];
    let payment_enum = ['waiting' , 'payment_made' , 'confirmed'];
    let order_enum = ['active' , 'completed' , 'canceled'];
    
    if(!payment && !order && !delivery){
        return res.status(404).json({message:"invalid format"})
    }
    let order_data = await orderSchema.findOne({invoice_number});
    if(!order_data){
        return res.status(404).json({message:"order not found"})
    }
    let {delivery_status , order_status , payment_status } = await order_data;
    delivery = deliver.toLowerCase();
    if(delivery && delivery_enum.includes(delivery)){
    	
    	let payload = {
        			invoice_number,
        			delivery_status:delivery,
        			payment
        		};

        redis.publish('order_status_channel' , JSON.stringify(payload));
        		
        order_data.delivery_status = delivery;
        
        if(delivery === 'delivered'){
        	order_data.order_status = 'completed'
        }
        
    }
    if(payment && payment_enum.includes(payment)){
        order_data.payment_status = payment;
    }
    if(order && order_enum.includes(order)){
        order_data.order_status = order;
    }
    await order_data.save();
        return res.json({ order:order_data });
    // }
        // catch(e) {
        //     console.log(e)
        //     res.status(400).json({ message: "Error occured while fetching order" });
        // }

}
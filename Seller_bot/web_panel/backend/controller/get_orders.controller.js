let orderSchema = require('../../../../models/order_models.js');
const seller_model = require('../../../../models/seller_model.js');
const user_model = require('../../../../models/user_model');


// @Method GET
// @data : [Object Orders (array)]
//@access : Private

module.exports = async (req, res) => {
    let { seller_id , limit , offset } = req.params;
    console.log(seller_id)
    try{
    	if(!limit) limit = 10;
    let order = await orderSchema.find({}).populate('ordered_by').populate('seller').populate({path:'products.product'});
    order.map(i=>i.seller?console.log(i._id):null)
    order = order.filter(i=>i.seller?i.seller.seller_id === seller_id:null);
    if(order.length){
    for(let i of order){
        if(i){
        console.log(Object.keys(i).includes('ordered_by'))
        user_model.findOne({_id:i.ordered_by})
        .then(data=>i.ordered_by = data)
    }
}
}else{
    return res.status(404).json({order:[]})
}
        return res.json({ order });
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while Fetching Orders" });
        }

}
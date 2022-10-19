let orderSchema = require('../../../../models/order_models.js');


// @Method GET
// @data : [Object order : _id]
//@access : Private

module.exports = async (req, res) => {
    let { id } = req.params;
    if(!id){
        return res.status(404).json({message:"order not found"})
    }
    try{
        
    let order = await orderSchema.findOne({_id:id});
    order.order_status = 'canceled';
    await order.save()
    res.status(200).json({msg:`Order no.${order._id} Canceled`});
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching order" });
        }

}
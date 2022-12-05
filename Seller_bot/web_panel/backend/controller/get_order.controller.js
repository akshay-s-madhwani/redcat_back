let orderSchema = require('../../../../models/order_models.js');


// @Method GET
// @data : [Object order]
//@access : Private

module.exports = async (req, res) => {
    let { id } = req.params;
    if(!id){
        return res.status(404).json({message:"order not found"})
    }
    try{
        
    let order = await orderSchema.findOne({_id:id}).populate('ordered_by').populate('seller').populate({path:'products.product'});

        return res.json({ order });
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching order" });
        }

}
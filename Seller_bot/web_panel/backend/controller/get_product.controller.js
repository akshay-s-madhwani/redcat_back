let productSchema = require('../../../../models/product_model.js');


// @Method GET
// @data : [Object Product]
//@access : Private

module.exports = async (req, res) => {
    let { id } = req.params;
    if(!id){
        return res.status(404).json({message:"Product not found"})
    }
    try{
        
    let product = await productSchema.findOne({product_id:id})
        return res.json({ product });
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching product" });
        }

}
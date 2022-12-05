let productSchema = require('../../../../models/product_model.js');
let sellerSchema = require('../../../../models/seller_model');

// @Method DELETE
// @data : [Object Product : title]
//@access : Private

module.exports = async (req, res) => {
    let { id } = req.params;
    if(!id){
        return res.status(404).json({message:"Product not found"})
    }
    try{
        
    let product = await productSchema.deleteOne({_id:id});
    let seller = await sellerSchema.deleteOne({productsUploaded:id});
    
        return await res.status(200).json({product , msg:"Product Deleted"});
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching product" });
        }

}
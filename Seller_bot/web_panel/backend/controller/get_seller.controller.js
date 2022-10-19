let sellerSchema = require('../../../../models/seller_model.js');


// @Method GET
// @data : [Object seller]
//@access : Private

//Incomlete
//Requires Getting seller by authorising from token only
module.exports = async (req, res) => {
    let { id } = req.params;
    if(!id){
        return res.status(404).json({message:"seller not found"})
    }
    try{
        
    let seller = await sellerSchema.findOne({seller_id:id}).populate('products_uploaded')
        return res.json({ seller });
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching seller" });
        }

}
let productSchema = require('../../../../models/product_model.js');


// @Method GET
// @data : [Object Product (array)]
//@access : Private

module.exports = async (req, res) => {
    let { limit , offset } = req.params;
    try{
        if(!limit)limit=10;
    let product = await productSchema.find({}).limit(limit).skip(offset)
        return res.json({ product });
    }
        catch(e) {
            console.log(e)
            res.status(400).json({ message: "Error occured while fetching products" });
        }

}
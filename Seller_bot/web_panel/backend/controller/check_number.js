let sellerSchema = require('../../../../models/seller_model.js');

module.exports = async (req , res )=>{
	// @Method POST
	// @Params number
	let { number } = req.body;
		if(!number){
			return res.status(400).json({msg:"No Number received, number is required"})
		}
	let name_exists = await sellerSchema.findOne({number});
	if(!name_exists){
	return res.status(200).json({msg:"success"});
	}else{
	return res.status(400).json({msg:"This number already Exists!!"})
	}
}
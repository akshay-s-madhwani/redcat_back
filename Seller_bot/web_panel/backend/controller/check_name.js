let sellerSchema = require('../../../../models/seller_model.js');

module.exports = async (req , res )=>{
	// @Method POST
	// @Params email shopname number password shopNumber ,building , street , city
	let { name } = req.body;
	console.log(req.body)
	if(!name){
		return res.status(400).json({msg:"Name is required"})
	}
	console.log(name)
	let name_exists = await sellerSchema.findOne({shop_name:name});
	console.log(name_exists)
	if(!name_exists){
	return res.status(200).json({msg:'success'});
	}else{
	return res.status(400).json({msg:"This name already Exists!!"})
	}
}
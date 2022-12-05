let sellerSchema = require('../../../../models/seller_model.js');

module.exports = async (req , res )=>{
	// @Method POST
	// @Params email shopemail number password shopNumber ,building , street , city
	let { email } = req.body;
		if(!email){
			return res.status(400).json({msg:"No Email received, email is required"})
		}
	let email_exists = await sellerSchema.findOne({email});
	console.log(email_exists)
	if(!email_exists){
	return res.status(200).json({msg:"success"});
	}else{
	return res.status(404).json({msg:"This email already Exists!!"})
	}
}
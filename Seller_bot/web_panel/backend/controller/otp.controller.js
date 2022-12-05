const redis = new (require('ioredis'))();
const seller_model = require('../../../../models/seller_model.js');

module.exports = async( req , res )=>{
	try{
	let { otp , number } = req.body;
	
	if(!otp || !number) return res.status(404).json({msg:"Necessary feilds required",success:false});
	
	let savedOtp = await redis.get(`otp_${number}`);

	if(!savedOtp) return res.status(404).json({msg:"No otp generated",success:false});

	if( savedOtp === otp ){
		await redis.set(`otp_${number}`,'');
		let seller = await seller_model.findOne({number});
		seller.verified = true;
		await seller.save();
		
		return res.json({msg:"Verified",success:true});
	}
	return res.json({msg:"OTP does not match",success:false})
	}
	catch(e){
		console.log(e);
		return res.status(500)
	}
}

let sellerSchema = require('../../../../models/seller_model.js');
const redis_pub = new (require('ioredis'))();

const redis_sub = new (require('ioredis'))();

module.exports = async (req , res )=>{
	// @Method POST
	// @Params number
	let { number } = req.body;
		if(!number){
			return res.status(400).json({msg:"No Number received, number is required"})
		}
	let number_exists = await sellerSchema.findOne({number});
	if(!number_exists){
	var numberExists = '';
	redis_pub.publish('check_number', number );
	redis_sub.subscribe('checked_number');
	redis_sub.on('message' , async (channel , message)=>{
    console.log(channel , message);
    if(channel === 'checked_number'){
      numberExists = message;
    }
	});
	
	setTimeout(()=>{
		res.status(200).json({msg:"success" , numberExists});
	} , 5000);
	return
	}else{
	return res.status(400).json({msg:"This number already Exists!!"})
	}
}
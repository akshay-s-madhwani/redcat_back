let bcrypt = require('bcrypt');
let shortid = require('shortid');
const jwt = require('jsonwebtoken');

let sellerSchema = require('../../../../models/seller_model.js');
const redis = new (require('ioredis'))();

module.exports = async (req , res )=>{
	// @Method POST
	// @Params email shopname number password shopNumber building , street , city
	let {email , shop_name , number , password , currency , house , building , street , city } = req.body 
	console.log(req.body)
	 let email_exists = await sellerSchema.findOne({email})
	 let name_exists = await sellerSchema.findOne({shop_name})
	 console.log(email_exists , name_exists)
	if(email_exists || name_exists){
		console.log('Checking Id')
		res.status(401).json({msg:`${email_exists?email_exists.email:name_exists.shop_name} already exists!!`})
		return
	}
try{
	let address = {
	house ,building ,street , city
}
	let new_user =  new sellerSchema({ 
		email,
		shop_name,
		password,
		currency,
		seller_id:shortid(),
		number,
		formatted_number:`${number}@s.whatsapp.net`,
		address
	})

	let jwt_user = {
		email,
		currency,
		shop_name,
		number,
		password,
		seller_id:new_user.seller_id
		}
 
	 await bcrypt.genSalt(10 , (err , salt)=>{
		if(err) throw err;
		bcrypt.hash(new_user.password , salt , (err, hash)=>{
			if(err) throw err;
			console.log('going forward')
			new_user.password = hash;
			jwt_user.password = hash;
			 new_user
			 .save()
			 .then(user=>{
			 jwt.sign(jwt_user , process.env.SECRET  , (err, token)=>{
				if(err) throw err;
				jwt_user.token = token;
				
				let otp = Math.floor(Math.random()*1000000);
				redis.set(`otp_${new_user.number}`,otp)
				redis.publish('registration_channel',JSON.stringify({ otp , number:new_user.number }));
				
				return res.status(200).json({
					shop_name:new_user.shop_name,
					email:new_user.email,
					number:new_user.number,
					currency:new_user.currency,
					seller_id:new_user.seller_id,
					verified : false,
					emailVerified : false,
					token
				})
			})
			}).catch(error=>{
				console.log(error);
				return res.status(401).json(error)
			})
		})
	})

	}catch(e){console.log(e)}
}
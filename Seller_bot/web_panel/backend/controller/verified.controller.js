const seller_model = require('../../../../models/seller_model.js');

module.exports = async(req , res)=>{
	try{
	let { number } = req.body;
	
	if( !number) return res.status(404).json({msg:"Necessary feilds required",success:false});

	let seller = await seller_model.findOne({number});
	
	if( !seller.verified ){
		
		return res.json({success:true});
	}
	return res.json({success:false})
	}
	catch(e){
		console.log(e);
		return res.status(500)
	}
}

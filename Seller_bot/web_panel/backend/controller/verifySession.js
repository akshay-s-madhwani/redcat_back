const jwt = require('jsonwebtoken');
const fs = require('fs');
const seller_model = require('../../../../models/seller_model.js');
const config = fs.readFileSync('../../../.env','utf8').replace(/\r/g,'').split('\n').map(i=>i.split('='));

module.exports = async (req , res )=>{
            let {token} = req.body;
            try{
                console.log(token.replace('Bearer ',''))
            let isMatch = jwt.verify(token.replace('Bearer ',''),config['SECRET']||'newSecret');
            if(isMatch){
                let {number , seller_id} = isMatch;
                let seller = await seller_model.findOne({seller_id});
                let {shop_name ,email , currency} = seller;
                console.log(seller)
                return res.json({success:true , msg:"valid", email , number , seller_id , name:shop_name , currency})
            }
            }catch(e){
                console.log(e)
                if(e){
                    return res.status(404).json({success:false,msg:"Invalid Token"})
                }
            }
}
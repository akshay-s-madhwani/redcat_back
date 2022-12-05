const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sellerSchema = require('../../../../models/seller_model.js')

module.exports = (req, res) => {
        const { number, password , newPass } = req.body
        console.log(req.body)
         sellerSchema.findOne({ number })
                .then((user) => {

                        if(!user) {
                                res.status(404).json({
                                        success:false,
                                        msg:'No user found' })
                                return
                        }


                        bcrypt.compare(password, user.password)
                                .then(async isMatch => {
                                        if(isMatch) {
                                                await bcrypt.genSalt(10 , (err , salt)=>{
                if(err) res.status(401).json({msg:'Failed to save'})
                bcrypt.hash(newPass , salt , async(err, hash)=>{
                        user.password = hash;
                        await user.save();
                        res.json({msg:'success',success:true})
                })
                                                })
                                                }
                                                else{
                                                	res.status(401).json({msg:'password does not match current one',success:false})
                                                }

                                })
                })
                .catch(e=>{res.status(401).json({msg:"Failed",success:false})})
}
                                

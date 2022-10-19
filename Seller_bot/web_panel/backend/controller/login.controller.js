const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sellerSchema = require('../../../../models/seller_model.js')

module.exports = (req, res) => {
	const { number, password } = req.body
	console.log(req.body)
	 sellerSchema.findOne({ number })
		.then((user) => {

			if(!user) {
				res.status(404).json({
					success:false,
					type:"user",
					msg:'No user found' })
				return
			}


			bcrypt.compare(password, user.password)
				.then(isMatch => {
					if(isMatch) {

						const payload = {
							number:user.number,
							password: user.password,
							shop_name:user.shop_name,
							currency:user.currency,
							email:user.email,
							seller_id:user.seller_id
						}

						jwt.sign(payload, process.env.SECRET, { expiresIn:'1d' }, (err, token) => {
							console.log(err)
							err ? res.sendStatus(404).json({
								success:false,
								type:"error",
								msg:'something went wrong' }) : null
							res.json({
								success:true,
								seller_id:user.seller_id,
								number:user.number,
								shop_name:user.shop_name,
								currency:user.currency,
								token:'Bearer ' + token
							})
						})
					} else {
						return res.status(404).json({
							success:false,
							seller_id:user.seller_id,
							type:"password",
							msg:'wrong Password' })
					}
				})

		})
		.catch(e => console.log(e))

}
// {"success":true,"token":}
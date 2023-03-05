const express = require('express')
const router = express.Router();

const register = require('../controller/register.controller');
const login = require('../controller/login.controller');
const number = require('../controller/check_number');
const name = require('../controller/check_name');
const email = require('../controller/check_email');
const verify_session = require('../controller/verifySession');
const is_verified = require('../controller/verified.controller.js');
const verifyOtp = require('../controller/otp.controller.js');

const change_password = require('../controller/changePassword.js');


const get_seller = require('../controller/get_seller.controller');

router.get('/redcatstore', (req,res)=>{
	res.redirect('https://wa.me/85262594255?text=hi');
	})
router.post('/signup' , register);
router.post('/signin' , login);
router.get('/get_seller/:id' , get_seller);
router.post('/check_name' , name);
router.post('/check_number' , number);
router.post('/check_email' , email);
router.post('/verify', verify_session);
router.post('/changepassword', change_password);
router.post('/verified',is_verified)
router.post('/otp',verifyOtp)


module.exports = router
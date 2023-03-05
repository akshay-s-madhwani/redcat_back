import { Config } from "../config";

export const register_user = async(data) => {
	try{
	let response = await fetch(Config.DOMAIN+'/signup', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(data) })

	response = await response.json()

	return response
	}catch(e){
		
		return null;
	}
}

export const login_user = async (data)=>{
	console.log(Config.DOMAIN);
	try{
	let response = await fetch(Config.DOMAIN+'/signin', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(data) });
	response = await response.json()
	return response
	}catch(e){
		
		return {success:false,type:'error'}  
	}
}

export const check_name = async(name) => {
	try{
	let response = await fetch(Config.DOMAIN+'/check_name', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ 'name':name }) })

	response = await response.json()

	return response
	}catch(e){
		
		return {msg:'Could not connect to servers at the moment'}
	}
}

export const check_number = async(number) => {
	try{
	let response = await fetch(Config.DOMAIN+'/check_number', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ number }) })

	response = await response.json()

	return response
	}catch(e){
		
		return {msg:'Could not connect to servers at the moment'}
	}
}

export const check_mail = async(email) => {
	try{
	let response = await fetch(Config.DOMAIN+'/check_email', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ email }) })

	response = await response.json()

	return response
}catch(e){
	
	return {msg:'Could not connect to servers at the moment'}
}
}
export const verify = async(email) => {
	try{
	let token = localStorage.getItem('CSRF_token');
	if(!token){
		return {success:false}
	}
	let response = await fetch(Config.DOMAIN+'/verify', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ token:token }) })

	response = await response.json()
	if(!response.success){
		localStorage.removeItem('CSRF_token')
	}
	return response
}catch(e){
		
	return {success:false}
}
};

export const change_password = async(password , newPass)=>{
	let {number} = JSON.parse(localStorage.getItem('store_'))
	try{
		let response = await fetch(Config.DOMAIN+'/changepassword', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ number , password , newPass }) })
	
		response = await response.json()
	
		return response
	}catch(e){
		;
		return {msg:'Could not connect to servers at the moment',success:false}
	}
}
export const add_collection_point = async(house , street , building)=>{
	let {number} = JSON.parse(localStorage.getItem('store_'))
	try{
		let response = await fetch(Config.DOMAIN+'/addCollection', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ number , house , building , street }) })
	
		response = await response.json()
	
		return response
	}catch(e){
		;
		return {msg:'Could not connect to servers at the moment',success:false}
	}
}

export const verifyOTP = async(otp)=>{
	try{
		let {number} = JSON.parse(localStorage.getItem('store_'))

		let response = await fetch(Config.DOMAIN+'/otp', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ otp , number }) })
	
		response = await response.json()
	
		return response
	}catch(e){
		;
		return {msg:'Could not connect to servers at the moment',success:false}
	}	
}

export const shouldVerify = async()=>{
	try{
		let {number} = JSON.parse(localStorage.getItem('store_'))
		let response = await fetch(Config.DOMAIN+'/verified', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ number }) })
	
		response = await response.json()
	
		return response
	}catch(e){
		;
		return {msg:'Could not connect to servers at the moment',success:false}
	}	
}
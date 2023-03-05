import { navigate } from "gatsby";
import { Config } from "../config";

 export const upload_products = async(data)=>{
	try{
		let store_ = localStorage.getItem('store_')
		// if(store_ !== 'undefined'){
		// 	return false;
		// }
	let {seller_id , number} = JSON.parse(store_)
	console.log(seller_id)
	// if(!seller_id ){
	// 	return false;
	// }
		let response = await fetch(`${Config.DOMAIN}/add_product` , { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({product:{...data, seller_id , currency:'HKD'}}) });
		response = await response.json();
		return response
}catch(e){
	return {message:"Could not connect to servers at the moment,please try again after a while"}
}
}

export const get_products = async( seller_id)=>{
	// try{
	
	let seller = await fetch(`${Config.DOMAIN}/get_seller/${seller_id}`);
	seller = await seller.json();
	let {products_uploaded} = seller.seller;
	if(products_uploaded.length >0){
	for(let i in products_uploaded){
	if(products_uploaded[i].properties.length > 0){
			products_uploaded[i] = {...products_uploaded[i],...products_uploaded[i].properties[0]}
	}}}
	return products_uploaded.reverse() || []
// }catch(e){
// 	console.log(e);
// 	return [{msg:"Could not connect to products",e:e}]
// }
}

export const delete_products = async(id)=>{
	try{
	let response = await fetch(`${Config.DOMAIN}/product/${id}` , {method : 'DELETE' ,headers:{'content-type':'application/json'}});
	response = await response.json()
	return response
}catch(e){
	console.log(e);
	return {msg:'Could not connect to servers at the moment'}
}
}
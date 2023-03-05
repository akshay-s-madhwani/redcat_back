import { Config } from "../config";

export const get_orders = async(offset=0)=>{
	try{
	let {seller_id} = JSON.parse(localStorage.getItem('store_'));
	let orders = await fetch(`${Config.DOMAIN}/orders/${seller_id}/10/${offset}`);
	orders = await orders.json();
	return orders
	}catch(e){
		console.log(e)
		throw e
	}
}
export const update_order = async(invoice , delivery , payment , status)=>{
	try{
	let response = await fetch(`${Config.DOMAIN}/order/${invoice}/${delivery}/${payment}/${status}` , {
		method:'PUT',
		"content-type":"application/json"
	});
	response = await response.json();
	console.log(response)
	return response}
	catch(e){
		console.log(e)
		return {data:'error'}
	}
}
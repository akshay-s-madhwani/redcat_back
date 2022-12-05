import { Config } from "../config";

export const get_orders = async(offset='')=>{
	let {seller_id} = JSON.parse(localStorage.getItem('store_'));
	let orders = await fetch(`${Config.DOMAIN}/orders/${seller_id}/10/offset`);
	orders = await orders.json();
	return orders
}

export const update_order = async(invoice , delivery , payment , status)=>{
	let {seller_id} = JSON.parse(localStorage.getItem('store_'));
	let response = await fetch(`${Config.DOMAIN}/orders/${invoice}/${delivery}/${payment}/${status}` , {
		method:'PUT',
		"content-type":"application/json"
	});
	response = await response.json();
	return response
}
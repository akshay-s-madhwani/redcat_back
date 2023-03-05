import { Config } from "../config";

 export const get_seller_details = async()=>{
	const isBrowser = typeof window !== "undefined"
	if(isBrowser){
	let {seller_id} = JSON.parse(localStorage.getItem('store_'))
		let seller = await fetch(`${Config.DOMAIN}/get_seller/${seller_id}`);
		seller = await seller.json();
		
		return seller
	}
}
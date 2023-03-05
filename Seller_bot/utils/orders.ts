// import { Prefix , wait , write_states , read_states , write_logs , possible_categories} from './utils/utility_methods';
const orderSchema = require('../../models/order_models')
const userSchema = require('../../models/user_model')
const sellerSchema = require('../../models/seller_model')
const productSchema = require('../../models/product_model')
const redis = new (require('ioredis'))();
import fs from 'fs';
const emoji = JSON.parse(fs.readFileSync('../emoji.json','utf8'))
const btn_text = JSON.parse(fs.readFileSync('../buttons.json','utf8'))

export function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

export const all_orders = async(socket:any , formatted_number:string)=>{
	let {_id , number} = await sellerSchema.findOne({formatted_number});
	let total_orders = await orderSchema.countDocuments();
	 let all_orders = await orderSchema.find({}).sort({date:-1,created_on:-1}).populate('seller').populate({path:'products.product'}).populate('ordered_by');
	 
console.log(all_orders[all_orders.length-1].seller.number)
	 console.log(number)
	 
	 let orders:any = [];
	 for(let i in all_orders){
	 	if(all_orders[i].seller){
	 		if( all_orders[i].seller.number === number)
{
			if(orders.length === 10){
				break;
			}
	 		orders.push(all_orders[i])
	 		}
	 	}
	 }
	 
	 if(!orders.length){
	 	return await socket.sendMessage(formatted_number , {text:"No Orders have been made by now\nLet\'s have faith and see"})
	 }
	 console.log(orders.slice(orders.length-4,orders.length-2))
	 orders.reverse();
	 for(let i of orders){
		 let date = convertTZ(i.created_on , "Asia/Hong_Kong");
		 let text = `*Date* : ${date.toLocaleString()}\n*Invoice No.* : ${i.invoice_number}\n\n`
	 	text += `CustomerName : ${ i.ordered_by?.pushname! || ''}\nPhone No.: ${i?.ordered_by?.number}\n\n`;
	 	text += `*Orders* :\n*_______________________________*\n`;
	 	for(let j of i.products){
			 text+=`*Title* : ${j.product.title},\n*Qty.*: ${j.quantity},\n*Price*: ${j.product.price}\n`;
			}
			text+=`\n*Gross Price*: ${i.gross_price}\nVAT: ${i.vat?i.vat+'%':'-'}\nExtra Charges: ${i.extra_charges?i.extra_charges:'-'}\nDiscount: ${i.discount?i.discount+'%':'-'}\n*Net price*: ${i.net_price}\n`;
			text+=`\nPayment Status: ${i.payment_status}\nDelivery Status: ${i.delivery_status}\nOrder status:${i.order_status}\n*_______________________________*`
			
			let buttons:object[] = [];
			if(i.delivery_status !== 'confirmed_delivery'){
				buttons.push({buttonId:`order_update_${i._id}_${_id}` , buttonText:{displayText:"Update Status"} , type:1});
			}
			buttons.push({buttonId:`order_cancel_${i._id}_${_id}` , buttonText:{displayText:"Cancel"} , type:1});
			
			await socket.sendMessage(formatted_number , {
				text,
				buttons,
				headerType:4
			});
		}
		await socket.sendMessage(formatted_number , {text:"Showing Last 10 orders received\nFor list of All orders, go to https://www.rcat.io/ and click on 'Orders'"})

}

export const current_orders = async(socket:any , formatted_number:string)=>{
	let {_id , number} = await sellerSchema.findOne({formatted_number});
	 let all_orders = await orderSchema.find({order_status:'active'}).sort({date:-1,created_on:-1}).populate('seller').populate({path:'products.product'}).populate('ordered_by');
	 let active_orders = all_orders.filter(i=>i.order_status === 'active')
	 let orders:any = [];
	 for(let i in all_orders){
	 	console.log(all_orders[i].seller)
	 	if(all_orders[i].seller){
	 		if( all_orders[i].seller.number === number)
			{
				if(orders.length === 10){
					break;
				}
	 		orders.push(all_orders[i])
	 		}
	 	}
	 }
	 console.log(orders)
	 if(!orders.length){
	 	return await socket.sendMessage(formatted_number , {text:"No Orders have been made by now\nLet\'s wait a while to get your First order here "})
	 }
	 orders.reverse()
	 for(let i of orders){
		 console.log(i.ordered_by)
		 let date = convertTZ(i.created_on , "Asia/Hong_Kong");
		 let text = `*Date* : ${date.toLocaleString()}\n*Invoice No.* : ${i.invoice_number}\n\n`
	 	text += `CustomerName : ${ i.ordered_by?.pushname! || ''}\nPhone No.: ${i?.ordered_by?.number}\n\n`;
	 	text += `*Orders* :\n*${emoji.divider.repeat(9)}*\n`;
	 	for(let j of i.products){
			 text+=`*Title* : ${j.product.title},\n*Qty.*: ${j.quantity},\n*Price*: ${j.product.price}\n`;
			}
			text+=`\n*${emoji.divider.repeat(9)}*\n*Gross Price*: ${i.gross_price}\nVAT: ${i.vat?i.vat+'%':'-'}\nExtra Charges: ${i.extra_charges?i.extra_charges:'-'}\nDiscount: ${i.discount?i.discount+'%':'-'}\n*Net price*: ${i.net_price||i.gross_price}\n`;
			text+=`\nPayment Status: ${i.payment_status}\nDelivery Status: ${i.delivery_status}\nOrder status:${i.order_status}\n*_______________________________*`
			
			let buttons:object[] = [];
			if(i.delivery_status !== 'confirmed_delivery'){
				buttons.push({buttonId:`order_update_${i._id}_${_id}` , buttonText:{displayText:"Update Status"} , type:1});
			}
			buttons.push({buttonId:`order_cancel_${i._id}_${_id}` , buttonText:{displayText:"Cancel"} , type:1});
			
			await socket.sendMessage(formatted_number , {
				text,
				buttons,
				headerType:4
			});
		}
		await socket.sendMessage(formatted_number , {text:"Showing Last 10 Active orders\nFor list of All orders, go to https://www.rcat.io/ and click on 'Orders'"})
	}

export const update_order = async(socket:any , formatted_number:string,order:string)=>{
	let order_ = order.split('_').slice(2,);
	let [order_id , seller_id] = [...order_];
	let sections = [
	{title:'Change Delivery Status',
	rows:[
	{rowId:`route_order_${order_id}_${seller_id}`,title:'En-Route'},
	{rowId:`delivered_order_${order_id}_${seller_id}`,title:'Delivered'}
	]}
	];

	await socket.sendMessage(formatted_number , {
		text:"Choose Status of Delivery",
		title:"Delivery Status",
		buttonText:"Delivery Status",
		sections
	})
};

export const set_update_order = async(socket:any , formatted_number:string , order:string , message:string)=>{
	let order_ = order.split('_').slice(2);
	let [order_id , seller_id] = [...order_];
	let {_id} = await sellerSchema.findOne({formatted_number});
	let order_data = await orderSchema.findOne({_id:order_id}).populate('seller').populate({path:'products.product'}).populate('ordered_by');

	console.log(message)
	let {ordered_by , invoice_number } = order_data;

	if(message === 'En-Route'){
		let rows:object[] = [];
		for(let i=1;i<=10;i++){
			rows.push({title:String(i),rowId:`delivery_duration_${order_id}_${seller_id}`})
		}
		let sections = [
		{title:"Days required to deliver",
		rows}
		];
		
		await socket.sendMessage(formatted_number , {
			title:"Days to deliver",
			text:"Select how many days product will take to reach customers Doorstep",
			buttonText:"Days to deliver",
			sections
		});
	}
	if(message.toLowerCase() === 'delivered'){
		order_data.delivery_status = 'delivered';
		await order_data.save();
		redis.publish('order_status_channel', JSON.stringify({invoice_number , delivery_status:"delivered"}))
		await socket.sendMessage(formatted_number , {text:"Thanks for letting us know, hope you had a great time using our stores\nYour payment will be transferred to you very soon"})
//		for(let i of order_data.products){
//		await socket.sendMessage(ordered_by.formatted_number , {
//			text:`*Important*\n${i.product.title} will soon reach your doorstep,\nPlease *Confirm*\n When received from your side,\nIf this product has not been delivered yet,\nThen press *confirm* only when You receive it emoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“emoji.dividerÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡`,
//			footer:`It is important to confirm the delivery when it gets delivered\nAs this Increases your points,\nGetting you Closer to Earn Incredible Coupons and Discounts\n\n*Note*:It will automatically be assumed as delivered after 7 days from this notification\nContact support for any issues regarding the process :-\nhttps://wa.me/919654558103?text=Hi`,
//			buttons:[
//			{buttonId:`delivered_confirmation_${order_data._id}_${_id}_${i.product._id}` , buttonText:{displayText:"Confirm"},type:1}
//			],
//			headerType:1
//		})
//	}
}
}

export const delivery_duration = async(socket:any , formatted_number:string , order:string , message:string)=>{
	try{
	let order_ = order.split('_').slice(2,);
	let [order_id , seller_id] = [...order_];
	let {_id} = await sellerSchema.findOne({formatted_number});
	let order_data = await orderSchema.findOne({_id:order_id}).populate({path:'products.product'}).populate('ordered_by');
	try{
	order_data.delivery_duration = Number(message);
	order_data.delivery_status = 'en-route';
	await order_data.save();
}catch(e){
	console.log(e)
}
let {invoice_number , gross_price , delivery_status} = order_data;
await console.log(order_data.ordered_by.formatted_number);
await redis.publish('order_status_channel', JSON.stringify({invoice_number , delivery_status}));
//	await socket.sendMessage(order_data.ordered_by.formatted_number , {
//		text:`*Hey*\n${order_data.products[0].product.title} has been Sent from the Store \nIt probably should reach to you in approx. ${order_data.delivery_duration} Days emoji.dividerÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡`
//	})
}catch(e){console.log(e)}
}

export const on_confirmation_of_order = async(socket:any , formatted_number:string , message:string)=>{
	let [order_id , seller_id , product_id] = message.split('_').slice(2,);
	console.log(message.split('_').slice(2,))
	let order_data =  await orderSchema.findOne({_id:order_id}).populate({path:'products.product'}).populate('ordered_by').populate('seller');
	let { products } = order_data;
	await console.log(order_data.ordered_by)
	let user = await userSchema.findOne({_id:order_data.ordered_by._id});
	let product = await productSchema.findOne({_id:product_id}) ;
	
		if(user.score){
			user.score = Number(user.score) + 10
			}else{ user.score = 10 } ;
		
		await user.save();
	
	await socket.sendMessage(user.formatted_number , {
		image:{url:'./static/confirm_delivery_rewards.jpg'},
		caption:`*Thank you for your Confirmation*,\nYou receive *+10* Points emoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â«emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°emoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸emoji.dividerÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»\nRemember, with each Confirmation of order, You get Closer to Amazing Coupons and Discounts emoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“emoji.dividerÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾\n\nCurrent Rewards list:\n*Epic Coupon code*: (score :50)\n*Special privileged Discounts*: (score:90)\nemoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œemoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨ *Legendary Coupon Code* emoji.dividerÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢emoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œemoji.dividerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¨: (score:120)`,
		footer:`Current Score: ${user.score}\n note:Scores gets reset after 40 days`,
		headerType:4
	});

	await socket.sendMessage(user.formatted_number , {
		image:{url:product.image},
		caption:`You may Leave a review for this product\nTitled:*${product.title.trim()}*\nWould love to have your feedback`,
		footer:`If you do not wish to leave a review right away, you can come back anytime later\nbut before 45 days`,
		buttons:[
		{buttonId:`review_add_${product_id}_${user._id}_${new Date(new Date().getTime()+60*60*60*400*45).getTime()}`,buttonText:{displayText:"Add review"},type:1}
		],
		headerType:4
	})

}
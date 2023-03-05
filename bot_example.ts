import { Boom } from '@hapi/boom';
import { config } from 'dotenv';
import { spawn } from 'child_process';
import makeWASocket, { AnyMessageContent, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState , proto } from '../src';
import MAIN_LOGGER from '../src/Utils/logger';
import { read_states , write_states , Prefix , write_logs } from './utilty_methods';
import mongoose, { Mongoose } from 'mongoose';

import fs, { read } from 'fs';
import path, { format } from 'path';

require('dotenv').config();

export let stripe;
if(process.env.NODE_ENV === 'prod'){
	stripe = (require('stripe'))(process.env.STRIPE_KEY_PROD);
}else{
	stripe = (require('stripe'))(process.env.STRIPE_KEY_DEV);
	}

import os from 'os';
import shortid from 'shortid';
import productSchema from './models/product_model';
import userSchema from './models/user_model';
import Redis from 'ioredis';
import order_models from './models/order_models';
import { add_to_cart } from './cart/add_to_cart';
import { remove_from_cart } from './cart/remove_from_cart';
import { show_cart } from './cart/show_cart';
import { update_cart_options } from './cart/update_cart_options';
import { update_cart_paymentMode } from './multi_order/update_cart_paymentMode';
import { generate_multi_receipts } from './multi_order/generate_multi_receipts';
import { ask_delivery_mode } from './order/ask_delivery_mode';
import { set_delivery_mode } from './order/set_delivery_mode';
import { update_buy_order } from './order/update_buy_order';
import { purchase_options } from './order/purchase_options';
import { multi_purchase_options } from './multi_order/multi_purchase_options';
import { generate_qr } from './multi_order/generate_qr'
import { prompt_for_location } from './address/prompt_for_location';
import { save_location } from './address/save_location';
import { save_location_house } from './address/save_location_house';
import { get_address } from './address/get_address';
import { set_address } from './address/set_address';
import { generate_qrcode } from './order/generate_qrcode';
import { show_products } from './show_products';
import { show_categorised_products } from './show_categorised_products';
import { next_page_products } from './next_page_products';
import { prev_page_products } from './prev_page_products';
import { confirm_delivery_customer } from './order/confirm_delivery_customer';
import { decline_confirm_delivery } from './order/decline_confirm_delivery';
import { get_feedback } from './review/get_feedback';
import { save_feedback } from './review/save_feedback';
import { init_review } from './review/init_review';
import { add_rating } from './review/add_rating';
import { add_review } from './review/add_review';
import { show_review } from './review/show_review';
import { show_menu } from './show_menu';
import { show_category } from './show_category';
import { generate_receipts } from './order/generate_receipts';
import { prompt_for_address } from './address/prompt_for_address';
const translated = require('./messages.js');

// import {proto } from '@adiwajshing/baileys/WAProto'
const logger = MAIN_LOGGER.child({});
logger.level = 'silent';
const redis = new Redis();
const redis_setters = new Redis();
redis.subscribe('payment_status_channel');
redis.subscribe('order_status_channel');
redis.subscribe('notifications')
export const emoji = JSON.parse(fs.readFileSync('./emoji.json','utf8'));
export const btn_text = JSON.parse(fs.readFileSync('./buttons.json','utf8'));
export const MINIMUM_ORDER = process.env.MINIMUM_ORDER;

export const offset = 5;
export let LANG = 1;
console.log(process.argv)
if(process.argv.length > 2 && process.argv[2]==='eng'){
	 LANG = 0;
	}

translated.lang = LANG;
config();
var session = module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);
console.log(session)

const emailer = (content:string)=>{
	let ps = spawn('python3' , ['email_utility.py', content ,'logicredefined@gmail.com'])
}

const store = makeInMemoryStore({logger});
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
  store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

const startSock = async (): Promise<{ sendSimpleMessage: (content: any, number: any)=> Promise<proto.WebMessageInfo>}> => {

  const normalPrefix = Prefix;

  const { state, saveCreds } = await useMultiFileAuthState(String(session))
  const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
  const socket = makeWASocket({
    logger,
    printQRInTerminal: true,
    auth: state
  });
  store?.bind(socket.ev);

  socket.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
        if(connection === 'close') {
        	emailer(`Connection is closed of RedCat Store`);
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            await redis_setters.set(session , 'false')
            emailer('Bot Logged out @'+session)
            // reconnect if not logged out
//            if(shouldReconnect) {
//                startSock()
//            }
        } else if(connection === 'open') {
        	await redis_setters.set(session , 'true')
            console.log('opened connection')
            socket.sendMessage('919654558103@s.whatsapp.net',{text:"Im Alive"})
            redis.on('message',async (channel:string , message:any)=>{
              console.log(channel)
              if(channel === 'payment_status_channel'){
                try{
                let parsed_message = JSON.parse(message);
                
                let {order_details , customer , number , info} = parsed_message;
                
                let { products , multi_seller , seller } = order_details._doc; 
                console.dir(parsed_message)
                  
          //	      return  await socket.sendMessage(number , {text:`Order Placed for Dispatch`});
              let saleInformation = JSON.parse(info);
                let products_:any = [];
                let product_details = "";
                for (let p of saleInformation){
                  let item = await productSchema.findOne({_id:p.product})
               console.log(item.title,new Date());
               product_details+=`*${item.title}*\n`;
                }
                console.log(product_details,new Date());
                
                if(!parsed_message.success){
                  let ps = spawn('python3' , ['email_utility.py', 'Payment Intent Failed',`Invoice Number: ${order_details!._doc!.invoice_number!}<br/> Please verify the matter as soon as possible`,'logicredefined@gmail.com'])
                  return await socket.sendMessage(`${number}@s.whatsapp.net` , {text:translated.payment_error()})
                }
               
                !multi_seller.length ? product_details+=`\nSold By: ${seller.shop_name}\nContact Info: ${seller.number}\n\n` : product_details+=`\nSold By: Multiple Different sellers`;
                
                 await socket.sendMessage(`${number}@s.whatsapp.net`, {
          text:`${translated.order_placed()}
          Invoice ID:${order_details!._doc!.invoice_number!}\n
          ${products_.length > 1?'Items':'Item'}:
          ${product_details}
          
          ${translated.will_inform()}`
              })
            }catch(e){
              console.log(e);
              let ps = spawn('python3' , ['email_utility.py', 'Payment Message sending Failed',`Payment Notification has failed to reach customer, Please relay the details: ${message}<br/> Please verify the matter as soon as possible`,'logicredefined@gmail.com'])
            }
                 }
                
            if(channel === 'notifications' ){
              let parsed_message = JSON.parse(message);
              let { invoice , target } = parsed_message;
              console.log('Notification',invoice , target)
              let order_data = await order_models.findOne({invoice_number:invoice})
              .populate('ordered_by')
              .populate('seller')
              .populate({path:'products.product'});
              
              let { ordered_by , seller , products , delivery_status , created_on } = order_data;
              
              if(target === 'customer'){
                let buttons = [
                {buttonId:`notify_customer_yes_${invoice}` , buttonText: {displayText:"Yes"}, type:1},
                {buttonId:`notify_customer_no_${invoice}` , buttonText: {displayText:"No"}, type:3},
                ];
          
          
          
                  await socket.sendMessage(`${ordered_by.number}@s.whatsapp.net` , {
          //				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
                  text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice}_\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
                  footer:translated.delivery_status_footer(),
                  buttons
                  })            
              }
              }
            
              if ( channel === 'order_status_channel' ){
                 let parsed_message = JSON.parse(message);
                console.log(parsed_message);
                
                let { 
                  invoice_number,
                    delivery_status,
                    payment
                  } = parsed_message;
                let order_details:{ordered_by:{number:string},products:[{product:{title:string},quantity:number,properties:[]}],seller:number} = await order_models.findOne({invoice_number})
                .populate('ordered_by')
              .populate('seller')
              .populate({path:'products.product'});
              
                if(order_details){
                let products = `${order_details!.products.length > 1?'Items':'Item'}:\n${order_details!.products.map(i=>`*${i.product.title}*\n`)}`;
                console.dir(order_details)
                if(delivery_status.toLowerCase() === 'en-route'){
                  socket.sendMessage(`${order_details.ordered_by.number}@s.whatsapp.net` , {text:translated.product_dispatched([order_details , emoji])})
                }
                if(delivery_status.toLowerCase() === 'delivered'){
                let buttons = [
                {buttonId:`notify_customer_yes_${invoice_number}` , buttonText: {displayText:"Yes"}, type:1},
                {buttonId:`notify_customer_no_${invoice_number}` , buttonText: {displayText:"No"}, type:2},
                ]
          console.log(order_details.ordered_by.number);
                await socket.sendMessage(`${order_details.ordered_by.number}@s.whatsapp.net` , {
          //				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
                  text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice_number}_\nItems: ${order_details.products.map(i=>`*${i.product.title}*`)}`,
                  footer:emoji.divider.repeat(9),
                  buttons
                  
                  
                  });
              }
                }
                }
              })
          
            // spawn('python3' , ['email_utility.py','Bot Stopped',`Redcat bot has Exited due to these reasons \n${e}`,'logicredefined+notification@gmail.com']);
        }
    await saveCreds();

  } );

  socket.ev.on('messages.upsert', async (message) => {
      write_logs(JSON.stringify(message))
    if(message.type === 'notify'){
    

      if(message.messages[0].status === 2) return;

      if(message.messages[0].key.remoteJid?.match(/@broadcast/gi)?.length) return;

      if(message.messages[0].key.remoteJid?.match(/@g.us/gi)?.length) return;

      if(message.messages[0].key.fromMe){return }

      let sender = message.messages[0];
      console.log(sender)
      let formatted_number = sender.key!.remoteJid!;


      let user = await userSchema.findOne({formatted_number});

      if(!fs.existsSync(`./customer/${formatted_number.replace(Prefix,'')}_states.json`)){
        fs.writeFileSync(`./customer/${formatted_number.replace(Prefix, '')}_states.json`, JSON.stringify({
          orders: {},waiting_for:"general", pagination: {
            page: 1,
            offset: 3
          },
          cart_paymentMode:'credit'
        }))
      }

      let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
    //   let DP;
    //   try{
    //   DP = await socket.profilePictureUrl(formatted_number);
    // }catch(e){
    //   console.log(e)
    // }
      if(!user){
            user  = await new userSchema({
              pushname:sender.pushName,
              user_id:shortid.generate(),
              number:formatted_number.replace(Prefix,''),
              formatted_number,
              cart:[]
            });
            user = await user.save();
            console.log(user)
             
//    translated.lang = 0;
    
      const buttonMessage = {
        text: translated.greetings([sender.pushName , emoji]),
        footer:"Please choose a language you would like to use this bot in",
        buttons:[
        {buttonId:'lang_eng_1',buttonText:{displayText:'English'},type:2},
        {buttonId:'lang_chin_1',buttonText:{displayText:'Chinese'},type:1}
        ],
        headerType: 2
      }
      return await socket.sendMessage(formatted_number , buttonMessage);
    }

  if(message.messages.length){

	let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
      if(message.messages[0].message){
      	let user_state = await read_states(user.number);
      if('language' in user_state){translated.lang = user_state.language ; LANG = user_state.language}
      console.log(user_state)

          let content , buttonResponse;
          if(Object.keys(sender!.message!).includes('conversation')){
          content = String(sender!.message!.conversation!);
          let state_ = read_states(formatted_number);
          console.log(content)
          if(state_.waiting_for.includes('address_location_house')){
            let product_id = state_.waiting_for.split('_')[3]
            if(product_id && product_id === 'multiple'){
            return await save_location_house(socket , formatted_number , content , false , '',true)
            }
            await save_location_house(socket , formatted_number , content , true , product_id)
          }
          if(state_.waiting_for.includes('address_manual')){
            let product_id = state_.waiting_for.split('_')[2]
            if(product_id && product_id === 'multiple'){
            return await set_address(socket , formatted_number , content , false , '',true);
            }
            await set_address(socket , formatted_number , content , true , product_id);
          }
          if(state_.waiting_for === 'review'){
            await add_review(socket , formatted_number , content);
          }
          if(state_.waiting_for.includes('no_confirmation')){
          	let stage = state_.waiting_for.split('_');
          	await save_feedback(socket , formatted_number , stage[2], stage[3], content);
          }
          if(['all',translated.chin_all].includes(content.toLowerCase().trim())){
            await show_products(socket , formatted_number , 1 )
          }
        if(content.toLowerCase().trim() === 'products'){
                await show_products(socket , formatted_number , 1 );
        }
        if(["hi","hii","hiiii","hey",".","hiya", "hello", "menu", "chao", "yo",translated.chin_menu,translated.chin_hey,translated.chin_buy].includes(content.toLowerCase().trim())){
            await show_menu(socket, formatted_number);
        }
        if(["categories","category","cat"].includes(content.toLowerCase().trim())){
          await show_category(socket , formatted_number)
        }
        if(content.toLowerCase().trim() === 'cart'){
           await show_cart(socket , formatted_number)
  }
}
      
        else if(Object.keys(sender!.message!).includes('buttonsResponseMessage')){
            let states_;
          content = sender!.message!.buttonsResponseMessage!;
          
          switch(content.selectedDisplayText!){
            case btn_text['Menu'][LANG]:
            await show_menu(socket, formatted_number);
            break;
            case btn_text['Categories'][LANG]:
            await show_category(socket , formatted_number)
            break;
            case btn_text['All Products'][LANG]:
            await show_products(socket , formatted_number , 1 )
            break;
            case `${btn_text['Next'][LANG]}${emoji.next_arrow}`:
            await next_page_products(socket , formatted_number , content.selectedButtonId);
            break;
            case `${emoji.prev_arrow}${btn_text['Prev'][LANG]}`:
            await prev_page_products(socket , formatted_number , content.selectedButtonId);
            break;
            case btn_text['Add to Cart'][LANG]:
            await add_to_cart(socket , formatted_number , content.selectedButtonId!.replace('_addtocart',''))
            break;
            case btn_text['Show cart'][LANG]:
            await show_cart(socket , formatted_number);
            break;
            case btn_text['Cart'][LANG]:
            await show_cart(socket , formatted_number);
            break;
            case btn_text['Remove'][LANG]:
            return await remove_from_cart(socket , formatted_number , content.selectedButtonId!)
            break;
            case btn_text['Buy'][LANG] :
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_)
            await purchase_options(socket , formatted_number , content!.selectedButtonId!.replace('_buy',''));
            break;
            case btn_text['Buy This only'][LANG]:
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_)
            await purchase_options(socket , formatted_number , content.selectedButtonId!.replace('_buy',''));
            break;
            case btn_text['Live Location'][LANG]:
              let productid_ = content.selectedButtonId!.split('_')[2]
              if(productid_ === 'multiple'){
                return await prompt_for_location(socket , formatted_number, false , '' ,true)
              }
              await prompt_for_location(socket , formatted_number, true , productid_)
            break;
            case btn_text['Enter Address Manually'][LANG]:
              let product_id = content.selectedButtonId!.split('_')[2]
              if(product_id === 'multiple'){
                return await get_address(socket , formatted_number , false , '' , true);
              }
              await get_address(socket , formatted_number , true, product_id);
            break;
            case btn_text['Proceed'][LANG] :
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_);
            await prompt_for_address(socket , formatted_number , false , '', true);
            break;
            
            case btn_text['Delivery Mode'][LANG]:
            await ask_delivery_mode(socket, formatted_number , content.selectedButtonId.split('_')[0])
            break;
            case btn_text['Proceed Delivery'][LANG]:
            await set_delivery_mode(socket , formatted_number , content.selectedButtonId);
            break;
            case btn_text['Generate Invoice'][LANG]:
            await generate_multi_receipts(socket , formatted_number )
            break;
            case btn_text['Current Address'][LANG]:
            let productid = content.selectedButtonId.split('_')[2];
            if(productid === 'multiple'){
              return await generate_multi_receipts(socket , formatted_number);
            }
            await generate_receipts(socket , formatted_number, productid)
            break;

            case 'English':
            let state__ = read_states(formatted_number);
            state__.language = 0;
            translated.lang = 0;
            LANG = 0;
            write_states(formatted_number , state__);
            await socket.sendMessage(formatted_number , {text:"Language set as English"});
//            await socket.sendMessage(formatted_number {text: translated.greetings([sender.pushName , emoji])})
            await show_menu(socket , formatted_number)
            break;

            case 'Chinese':
            let state___ = read_states(formatted_number);
            state___.language = 1;
            translated.lang = 1;
            LANG = 1;
            write_states(formatted_number , state___);
            await socket.sendMessage(formatted_number , {text:translated.set_chinese});

            let id = content.selectedButtonId!.split('_');
            if(id[2] !=='menu'){
            await socket.sendMessage(formatted_number ,{text: translated.greetings([sender.pushName , emoji])})
            }
            await show_menu(socket , formatted_number)
            break;

		  case translated.change_language():
		  const buttonMessage = {
        text:"Please choose a language you would like to use this bot in",
        buttons:[
        {buttonId:'lang_eng_menu',buttonText:{displayText:'English'},type:2},
        {buttonId:'lang_chin_menu',buttonText:{displayText:'Chinese'},type:1}
        ],
        headerType: 2
      }
      await socket.sendMessage(formatted_number , buttonMessage);
      	break;
            case btn_text['Proceed to Pay'][LANG]:
            await generate_qrcode(socket , formatted_number);
            break;
            case btn_text['Proceed to Pay Multi'][LANG]:
            await generate_qr(socket , formatted_number);
            break;

            case btn_text['Cancel order'][LANG]:
            await socket.sendMessage(formatted_number , {text:translated.order_cancelled()});
            await show_menu(socket, formatted_number);
            break;

            case 'Reviews':
		  await show_review(socket , formatted_number , content.selectedButtonId!.split('_')[0] , 0);
            break;

            case btn_text['feedback'][LANG]:
            await get_feedback(socket, formatted_number , content.selectedButtonId! , content);
            break;

            case btn_text['complaint'][LANG]:
            await get_feedback(socket, formatted_number , content.selectedButtonId! , content);
            break;

          case btn_text['add_review'][LANG]:
          let id_ = content.selectedButtonId!.split('_');
          await init_review(socket , formatted_number , id_[2]);
          break;
          }
          

          
		let ids = content.selectedButtonId!.split('_');
		if(ids[0] === 'cancel'){
			if(ids[1] === 'reviews'){
				let state_ = read_states(formatted_number);
				state_.waiting_for = 'general';
				write_states(formatted_number , state_) ;
				return await socket.sendMessage(formatted_number, {text:translated.review_closed()});
			}
		}
		if(ids[0] === 'notify'){
				if(ids[1] === 'customer' && ids[2] === 'yes'){
					await confirm_delivery_customer(socket , formatted_number , ids[3]);
				}
				else{
					await decline_confirm_delivery(socket , formatted_number , ids[3]);
				}
			}
		

		
          for( let category of categories){
            if(content.selectedDisplayText === category.name){
              console.log(content.selectedDisplayText)
              await show_categorised_products(socket , formatted_number , category.name , 1)
            }
          }
          console.log(content.selectedDisplayText)
        }
        else if(Object.keys(sender!.message!).includes('listResponseMessage')) {
          content = sender!.message!.listResponseMessage!;

          // If Selected option is a Category option from the list
          for( let category of categories){
            if(String(content.title) === String(category.name)){
              return await show_categorised_products(socket , formatted_number , category.name , 1)
            }
          }

          
          let details = content.singleSelectReply!.selectedRowId!.split('_');
          console.log(details);
          let states = await read_states(formatted_number.replace(Prefix,''));
          if(details[1] === 'rating'){
          	let stage = states.waiting_for?.split('_');
          	if(stage[0] === 'rating'){
          		if(stage[1] === details[0]){
          	return await add_rating(socket , formatted_number , details[0] , details[2])
          	}
          	else if(stage[1] !== details[0]){
          		return await socket.sendMessage(formatted_number , {text:"Sorry , We dont think this is the list of rating you should be selecting, please select the fresh one"})
          		}
          	}else{
          		return await socket.sendMessage(formatted_number , {text:"Sorry , We did not understood what you meant by a rating right now"})
          		}
          }
          if(details[1] === 'collection'){
            await set_delivery_mode(socket , formatted_number , content.singleSelectReply!.selectedRowId!);
          }
          // let product__ = await productSchema.findOne({product_id:details[0]});
          // if(!product__){ await socket.sendMessage(formatted_number, {text:translated.product_error()})};
          
          let {order} = states;
          console.log(details)
          if(details[3] === 'order' && details.length < 5 ){
          await update_buy_order(formatted_number.replace(Prefix,'') , details[0] , details[1] , details[2])
           
          await socket.sendMessage( formatted_number, {text:translated.updated_product(content.title , details[1])})
          }
          if(details[3] === 'order' && details.length > 4 && details[4] === 'cart'){
            //If it is updating Payment Mode , both first and last pointers are cart, otherwise only updates properties
            if(details[0] === 'cart'){
              return await update_cart_paymentMode(socket , formatted_number , details[2] )
            }
            let options = details.slice(0,3).join('_');
            console.log({options});
            await update_cart_options(socket , formatted_number , options)
          }
          
          

        //   switch(content.singleSelectReply!.selectedRowId!){
        //     case '':        //     break;
        // }
        
  }
  
  else if(Object.keys(sender!.message!).includes('locationMessage')){
    content = sender!.message!.locationMessage;
    let state_ = read_states(formatted_number);
    if(state_.waiting_for.includes('address_location')){
        let product_id = state_.waiting_for.split('_')[2]
        if(product_id === 'multiple'){
          return await save_location(socket , formatted_number , {latitude:content.degreesLatitude,longitude:content.degreesLongitude , name:content.name , address:content.address} , false , '' , true )
        }
        await save_location(socket , formatted_number , {latitude:content.degreesLatitude,longitude:content.degreesLongitude , name:content.name , address:content.address} , true , product_id )
    }else{
      await socket.sendMessage(formatted_number , {text:translated.location_error()})
    }
  }
//  else if(Object.keys(sender!.message!).includes('templateButtonReplyMessage')){
//  	let content = sender!.message!.templateButtonReplyMessage!;
//  	let button_id = content!.contextInfo!.quotedMessage!.templateMessage!.hydratedFourRowTemplate!.hydratedButtons!;
//  	let selectedIndex = content!.selectedIndex!;
//
//  	let selectedButton = button_id![selectedIndex!].quickReplyButton!.id;
//  	if(selectedButton){
//  		let selectedButtonId = selectedButton.split('_');
//  		if(selectedButtonId[0] === 'notify' && content!.selectedDisplayText === 'yes'){
//  			
//					return await confirm_delivery_customer(socket , formatted_number , selectedButtonId[1]);
//				}
//				else{
//					return await decline_confirm_delivery(socket , formatted_number , selectedButtonId[1]);
//				}
//  		}
//  	}
// redis.on('message',async (channel:string , message:any)=>{
//   console.log(channel)
//   if(channel === 'payment_status_channel'){
//     let parsed_message = JSON.parse(message);
    
//     let {order_details , customer , number , info} = parsed_message;
    
//     let { products , multi_seller , seller } = order_details._doc; 
    
// //	      let ps = spawn('python3' , ['email_utility.py','Failed to furnish order Details',`Invoice Number: ${order_details!._doc!.invoice_number!}<br/> Please look into it urgently`,'logicredefined@gmail.com'])
// //	      return  await socket.sendMessage(number , {text:`Order Placed for Dispatch`});
//   let saleInformation = JSON.parse(info);
//     let products_:any = [];
//     let product_details = "";
//     for (let p of saleInformation){
//       let item = await productSchema.findOne({_id:p.product})
//    console.log(item.title,new Date());
//    product_details+=`*${item.title}*`;
//     }
//     console.log(product_details,new Date());
    
//     if(!parsed_message.success){
//       let ps = spawn('python3' , ['email_utility.py', 'Payment Intent Failed',`Invoice Number: ${order_details!._doc!.invoice_number!}<br/> Please verify the matter as soon as possible`,'logicredefined@gmail.com'])
//       return await socket.sendMessage(number , {text:translated.payment_error()})
//     }
   
//     !multi_seller.length ? product_details+=`\nSold By: ${seller.shop_name}\nContact Info: ${seller.number}\n\n` : product_details+=`\nSold By: Multiple Different sellers`;
    
//      await socket.sendMessage(number , {
// text:`${translated.order_placed()}
// Invoice ID:${order_details!._doc!.invoice_number!}\n
// ${products_.length > 1?'Items':'Item'}:
// ${product_details}

// ${translated.will_inform()}`
//   })
//      }
    
// if(channel === 'notifications' ){
//   let parsed_message = JSON.parse(message);
//   let { invoice , target } = parsed_message;
//   console.log('Notification',invoice , target)
//   let order_data = await order_models.findOne({invoice_number:invoice})
//   .populate('ordered_by')
//   .populate('seller')
//   .populate({path:'products.product'});
  
//   let { ordered_by , seller , products , delivery_status , created_on } = order_data;
  
//   if(target === 'customer'){
//     let buttons = [
//     {buttonId:`notify_customer_yes_${invoice}` , buttonText: {displayText:"Yes"}, type:1},
//     {buttonId:`notify_customer_no_${invoice}` , buttonText: {displayText:"No"}, type:3},
//     ];



//       await socket.sendMessage(ordered_by.number , {
// //				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
//       text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice}_\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
//       footer:translated.delivery_status_footer(),
//       buttons
//       })            
//   }
//   }

//   if ( channel === 'order_status_channel' ){
//      let parsed_message = JSON.parse(message);
//     console.log(parsed_message);
    
//     let { 
//       invoice_number,
//         delivery_status,
//         payment
//       } = parsed_message;
//     let order_details = await order_models.findOne({invoice_number})
//     .populate('ordered_by')
//   .populate('seller')
//   .populate({path:'products.product'});
  
//     if(order_details){
//     let products = `${order_details!.products.length > 1?'Items':'Item'}:\n${order_details!.products.map(i=>`*${i.product.title}*\n`)}`;
//     if(delivery_status.toLowerCase() === 'en-route'){
//       socket.sendMessage(order_details.ordered_by.number , {text:translated.product_dispatched([order_details , emoji])})
//     }
//     if(delivery_status.toLowerCase() === 'delivered'){
//     let buttons = [
//     {buttonId:`notify_customer_yes_${invoice_number}` , buttonText: {displayText:"Yes"}, type:1},
//     {buttonId:`notify_customer_no_${invoice_number}` , buttonText: {displayText:"No"}, type:2},
//     ]
// console.log(order_details.ordered_by.number);
//     await socket.sendMessage(order_details.ordered_by.number , {
// //				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
//       text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice_number}_\nItems: ${order_details.products.map(i=>`*${i.product.title}*`)}`,
//       footer:'_______________________________',
//       buttons
    
      
//       });
//   }
//     }
//     }
//   })
  	}
  }
}
    
} )

  return new Promise((resolve) => {

    socket.ev.on('connection.update', async (update) => {

      const { connection, lastDisconnect } = update;
  
      if(update.qr){
  
        // save the qrcode, the data is base64
        console.log(update.qr);
  
      }
  
      if(connection === 'close') {

        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if(shouldReconnect) {
  
          const client = await startSock();
          resolve(client);

          return;

        }

      }
      
      if(connection === 'open') {
        
  
        resolve({
        
          async sendSimpleMessage( number: any , content: any): Promise<proto.WebMessageInfo> {


            // console.log(await socket.sendMessage(`${number}${normalPrefix}`, { text: content }));

            const sendMessage = await socket.sendMessage(`${number}${normalPrefix}`, content);
        
            if(typeof sendMessage === 'undefined') throw { message: 'Not was possible send this message' }
                                                          
            return sendMessage;
        
          },
        
        })
  
      }
  
    });

  });

}

(async () => {

  const client = await startSock();
  
      
  })()

process.on('exit',(e)=>{
  console.log('Exit Message: ',e);
  let ps = spawn('python3' , ['email_utility.py','Bot Stopped',`Redcat bot has Exited due to these reasons \n${e}`,'logicredefined@gmail.com']);
})
process.on('unhandledRejection',(e)=>{
  console.log('Unhandled Rejection Message: ',e);
  let ps = spawn('python3' , ['email_utility.py','Bot Stopped',`Redcat bot has stopped due to these Unhandled rejections \n${e}`,'logicredefined@gmail.com']);
})
process.on('uncaughtException',(e)=>{
  console.log('Exception Message: ',e);
  let ps = spawn('python3' , ['email_utility.py','Bot Stopped',`Redcat bot has stopped due to these Uncaught Exceptions \n${e}`,'logicredefined@gmail.com']);
})
process.on('disconnect',(e)=>{
  console.log('Disconnect Message: ',e);
  let ps = spawn('python3' , ['email_utility.py','Bot Stopped',`Redcat bot has Disconnected due to these reasons \n${e}`,'logicredefined@gmail.com']);
})

//   const MessageSended = await client.sendSimpleMessage( 'Sent from Baileys' , '919654558103');
// console.log(JSON.stringify(MessageSended, undefined, 2));


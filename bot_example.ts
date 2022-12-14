import { Boom } from '@hapi/boom';
import { config } from 'dotenv';
import { spawn } from 'child_process';
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState , proto } from '../src';
import MAIN_LOGGER from '../src/Utils/logger';
import { read_states , write_states , wait , Prefix , write_logs } from './utilty_methods';
import mongoose, { Mongoose } from 'mongoose';

import fs, { read } from 'fs';
import path, { format } from 'path';

require('dotenv').config();

let stripe;
if(process.env.NODE_ENV === 'prod'){
	stripe = (require('stripe'))(process.env.STRIPE_KEY_PROD);
}else{
	stripe = (require('stripe'))(process.env.STRIPE_KEY_DEV);
	}
const qrcode = require('qrcode');
import os from 'os';
import shortid from 'shortid';
import productSchema from './models/product_model';
import userSchema from './models/user_model';
import feedbackSchema from './models/feedback_model';
import sellerSchema from './models/seller_model';
import Redis from 'ioredis';
import order_models from './models/order_models';
const translated = require('./messages.js');

// import {proto } from '@adiwajshing/baileys/WAProto'
const logger = MAIN_LOGGER.child({});
logger.level = 'silent';
const redis = new Redis();
redis.subscribe('payment_status_channel');
redis.subscribe('order_status_channel');
redis.subscribe('notifications')
const emoji = JSON.parse(fs.readFileSync('./emoji.json','utf8'));
const btn_text = JSON.parse(fs.readFileSync('./buttons.json','utf8'));

const offset = 5;
let LANG = 1;
console.log(process.argv)
if(process.argv.length > 2 && process.argv[2]==='eng'){
	 LANG = 0;
	}
translated.lang = LANG;
config();
var session = module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);
console.log(session)


//==============All Products===========================================================================
const show_products = async(socket:any ,formatted_number:string , start:number ) =>{
  let state_ = read_states(formatted_number);
  state_.pagination.page = start;
  let { page } = state_.pagination;

  write_states(formatted_number , state_)
      const products = await productSchema.find({}).limit(offset).skip( ( page - 1 ) * offset );
      
      console.log(products.length);

      const total_products = await productSchema.countDocuments();
      
      for(let product of products){
    
      const buttons = [
        { buttonId: `${product.product_id}_buy`, buttonText: { displayText: btn_text[`Buy`][LANG] }, type: 1 },
        { buttonId: `${product.product_id}`, buttonText: { displayText: btn_text[`Add to Cart`][LANG] }, type: 2 },
        { buttonId: `${product.product_id}__reviews`, buttonText: { displayText: btn_text[`Reviews`][LANG] }, type: 3 }
      ]

   const buttonMessage = {
     image: { url: product.image.startsWith('http') ? product.image : `./Seller_bot/${product.image.replace('./', '')}` },
     caption: `*${product.title.trim()}*
${product.description.split(' ').slice(0,50).join(' ')+'\n\n'+ product.description.split(' ').slice(50).join(' ')}`,
     footer: `Price: ${product.currency} *${product.price}*             in_stock:${product.stock} 
rating:*${product.rating.rate||'0.0'}*(${product.rating.count||0})`,
     buttons: buttons,
     headerType: 2
   }
      // console.log(message.messages[0].key.remoteJid);
      await socket.presenceSubscribe(formatted_number)
        await delay(50)
    
        await socket.sendPresenceUpdate('composing', formatted_number)
        await delay(200)
    
        await socket.sendPresenceUpdate('paused', formatted_number)
      
    await socket.sendMessage(formatted_number, buttonMessage)
      }

    //==========Pagination in All==============================

//    let {page , offset} = state_.pagination;

    let nextButton = {
      text:`Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:'all_products' , buttonText:{displayText:`${btn_text['Next'][LANG]}${emoji.next_arrow}`} , type:1
      }],
      headerType:1
    }
    let prevButton = {
     text:`Go To Page: ${Number(page)>1?Number(page)-1:Number(page)}`,
      buttons:[{
        buttonId:'all_products' , buttonText:{displayText:`${emoji.prev_arrow}${btn_text['Prev'][LANG]}`} , type:1
      }],
      headerType:1
    }
    let paginate_buttons = {
      text:`Go To Page: ${Number(page)-1} or Go To Page: ${Number(page)+1}`,
      footer:"______________________",
      buttons:[{
        buttonId:'all_products' , buttonText:{displayText:`${emoji.prev_arrow}${btn_text['Prev'][LANG]}`} , type:1
      },{
        buttonId:'all_products' , buttonText:{displayText:`${btn_text['Next'][LANG]}${emoji.next_arrow}`} , type:3
    }],
      headerType:4
    }
    
    console.log(total_products - ((page)*offset))
    // if products.length = 23
    
    if(page === 1 && total_products -  (page * offset ) >= offset){
      await socket.sendMessage(String(formatted_number) , nextButton)
    }
    // if ( ( products.length - ( 1 * 5 ) ) < 5 OR ( products.length - 10 ) < 5 === ONLY PREV BUTTON
    else if(page > 1 && total_products - ( ( page-1 ) * offset) < offset){
        await socket.sendMessage(String(formatted_number) , prevButton)
    }
    // if page IS 1 AND products.length IS < 5 === NO BUTTONS
    else if(page === 1 && total_products - ((page-1)*offset) < offset ){

    }
    // if ( ( products.length - ( 1 * 5 ) ) > 5 OR ( products.length - 15 ) > 5 === ONLY PREV BUTTON
    
    else if(page > 1 && total_products - ( ( page-1 ) * offset) > offset){
    	
     await socket.sendMessage(String(formatted_number) , paginate_buttons) 
    }
  }


//=============Categorised products=====================================================
const show_categorised_products = async(socket:any , sender : string , category : string , start:number) =>{
	console.log(category)
      const states = await read_states(sender);
      states.pagination.category = category;
      states.pagination.page = start;
      write_states(sender, states)
      let { page } = states.pagination;
      
      const products = await productSchema.find({category}).limit(offset || 5).skip( ( page - 1 ) * offset )
	 const total_products = await productSchema.countDocuments();
      console.log(total_products);
      
      				
      for(let product of products){
    
         const buttons = [
           { buttonId: `${product.product_id}_buy`, buttonText: { displayText: btn_text[`Buy`][LANG] }, type: 1 },
        { buttonId: `${product.product_id}`, buttonText: { displayText: btn_text[`Add to Cart`][LANG] }, type: 2 },
        { buttonId: `${product.product_id}__reviews`, buttonText: { displayText: btn_text[`Reviews`][LANG] }, type: 3 }
         ]

      const buttonMessage = {
        image: { url: product.image.startsWith('http') ? product.image : `./Seller_bot/${product.image.replace('./', '')}` },
        caption: `*${product.title.trim()}*
${product.description.split(' ').slice(0,50).join(' ')+'\n\n\n\n'+product.description.split(' ').slice(0,50).join(' ')}`,
        footer: `Price: ${product.currency} *${product.price}*             in_stock:${product.stock} 
rating:*${product.rating.rate||'0.0'}*(${product.rating.count||0})`,
        buttons: buttons,
        headerType: 2
      }
      
//      await socket.presenceSubscribe(sender)
        // await delay(100)
    
        // await socket.sendPresenceUpdate('composing', sender)
        // await delay(2000)
    
//        await socket.sendPresenceUpdate('paused', sender)
      if(sender){
        try{
    const sendMsg = await socket.sendMessage(String(sender), buttonMessage , true , 'zh');
  }catch(e){
    console.trace(e)
  }
    await delay(100)
      }
      }
    let nextButton = {
      text:`Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:category , buttonText:{displayText:`${btn_text['Next'][LANG]}${emoji.next_arrow}`} , type:1
      }],
      headerType:1
    }
    let prevButton = {
     text:`Go To Page: ${Number(page)>1?Number(page)-1:Number(page)}`,
      buttons:[{buttonId:category , buttonText:{displayText:`${emoji.prev_arrow}${btn_text['Prev'][LANG]}`} , type:1}],
      headerType:1
    }
    let paginate_buttons = {
      text:`Go To Page: ${Number(page)-1} or Go To Page: ${Number(page)+1}`,
      footer:'_'.repeat(12),
      buttons:[
      	  { buttonId: category, buttonText: { displayText:`${btn_text['Next'][LANG]}${emoji.next_arrow}` }, type: 2 },
            { buttonId: category, buttonText: { displayText: `${emoji.prev_arrow}${btn_text['Prev'][LANG]}` }, type: 3 }
            ],
      headerType:1
    }
    
    console.log(total_products - ((page)*offset))
    // if products.length = 23
    
    if(page === 1 && total_products -  (page * offset ) >= offset){
      await socket.sendMessage(String(sender) , nextButton)
    }
    // if ( ( products.length - ( 1 * 5 ) ) < 5 OR ( products.length - 10 ) < 5 === ONLY PREV BUTTON
    else if(page > 1 && (total_products - ( ( page-1 ) * offset)) < offset){
        await socket.sendMessage(String(sender) , prevButton)
    }
    // if page IS 1 AND products.length IS < 5 === NO BUTTONS
    else if(page === 1 && total_products - ((page-1)*offset) < offset ){

    }
    // if ( ( products.length - ( 1 * 5 ) ) > 5 OR ( products.length - 15 ) > 5 === ONLY PREV BUTTON
    
    else if(page > 1 && (total_products - ( ( page-1 ) * offset)) > offset){
    	console.log('left products', total_products - (page-1) * offset)
     await socket.sendMessage(String(sender) , paginate_buttons) 
    }

}

const next_page_products = async (socket:any , sender:string , buttonId:string)=>{
  const states = await read_states(sender);
  let {page} = states.pagination;
  page+=1;
  states.pagination.page = page;
  write_states(sender, states);
  if(buttonId === 'all_products'){
    return await show_products(socket , sender , page);
  }
  let { category } = states.pagination;
  return await show_categorised_products(socket , sender , category, page)
}
const prev_page_products = async (socket:any , sender:string , buttonId:string)=>{
  const states = await read_states(sender);
  if(states.pagination.page <= 1){
  	await socket.sendMessage(sender , {text:"Already on Page 1"});
  	return
  }
  let { page } = states.pagination;
  page -= 1;
  states.pagination.page = page;
  write_states(sender, states);
  if(buttonId === 'all_products'){
    return await show_products(socket , sender , page)
  }
  let {category } = states.pagination;
  return await show_categorised_products(socket , sender , category , page)
};


const add_to_cart = async(socket:any , sender:string , id:string)=>{
      let user_ = await userSchema.findOne({formatted_number : sender});
      let product = await productSchema.findOne({product_id:Number(id)});
      if(!product){
        return await socket.sendMessage(sender , {text:translated.no_product()});
      }
      console.log(product)
      await user_.cart.push(product._id);
      await user_.save();
      let cart_buttons = [{
        buttonId:'cart',buttonText:{displayText:btn_text['Show cart'][LANG] , type:1}
      }]
      await socket.sendMessage(sender , {text : `Product : ${product.title} \nAdded to Cart` , footer:`Cart size:${user_.cart.length}`, buttons:cart_buttons})
};

const remove_from_cart = async (socket:any , sender:string , id:string)=>{
  let user_ = await userSchema.findOne({formatted_number : sender});
  let id_ = await productSchema.findOne({product_id:Number(id)});
    user_.cart = await user_.cart.filter(i=>i !== id_._id);
    await user_.save();
    let message = {
      text: 'Removed',
      buttons: [{
        buttonId: 'cart', buttonText: { displayText: btn_text['Show cart'][LANG] }, type: 1
      }],
      headerType: 4
    }
    await socket.sendMessage(sender , message)
}

const show_cart = async(socket:any , sender:string)=>{      
      await userSchema.findOne({formatted_number:sender}).populate('cart').exec(async (error:any ,items:any)=>{
        
        let products_ = await items.cart;
        if(!products_.length){
          let buttons = [
            { buttonId: 'categories', buttonText: { displayText: btn_text['Categories'][LANG] }, type: 1 }
          ]
          let buttonMessage = {
            text: 'Oops, your cart seems completely empty and sad, Try adding some products in here to make it happy',
            buttons: buttons,
            headerType: 4
          }
          return await socket.sendMessage(sender , buttonMessage);
        }
        for(let i of products_){
        	let { product_id , image , title , currency , price } = i;
          let buttons = [
            { buttonId: product_id + '_buy', buttonText: { displayText: btn_text['Buy This only'][LANG] }, type: 1 },
            { buttonId: product_id, buttonText: { displayText: btn_text['Remove'][LANG] }, type: 3 }
          ];

          let buttonMessage;
          if(image){
          image.startsWith('http')?image:image=`./Seller_bot/${image.replace('./','')}`;
          if(image.startsWith('./Seller_bot')){
          	if(fs.existsSync(image)){
           buttonMessage = {
            image: { url: image },
            caption: `${title}`,
            footer: `Price: ${currency} ${price}`,
            buttons: buttons,
            headerType: 2
          }
          	}
          
          	else{
          buttonMessage = {
            text:title,
            footer: `Price: ${currency} ${price}`,
            buttons: buttons,
            headerType: 4
         		 }

         	}
         }
          	else{
          buttonMessage = {
            image: { url: i.image },
            caption: `${i.title}`,
            footer: `Price: ${i.currency} ${i.price}`,
            buttons: buttons,
            headerType: 2
          	}
          }
          }
          	else{
          buttonMessage = {
            text:title,
            footer: `Price: ${currency} ${price}`,
            buttons: buttons,
            headerType: 4
         		 }

         	}
           
          await socket.sendMessage(sender , buttonMessage);
        }
        let all_costs = await products_.map((i:any)=>i.price)
        let total_cost =await all_costs.reduce((acc:any,cur:any)=>acc+cur)
        let buy_all_message = {
          text: `Proceed to Purchase all \n@ ${total_cost}`,
          buttons: [{
            buttonId: 'purchase_all_from_cart', buttonText: { displayText: btn_text['Proceed'][LANG] }, type: 1
          }],
          headerType: 4
        }
        await socket.sendMessage(sender , buy_all_message)
      })
}

const update_buy_order = async (sender:string , product_id:string , type:string , value:string , new_price:number=0 , currency:string='$')=>{
  let state_ = await read_states(sender  );
      let {order , price} = state_;
      order[product_id] = order[product_id]?order[product_id] :{};
      order[product_id][type] = value;
      state_.order = order
      state_.currency = 'hkd'
      if(new_price){
        state_.price += new_price;
      }
      write_states(sender, state_)
}
const purchase_options = async(socket:any , sender:string , product_id:number , multiple:boolean=false)=>{
  let product_ = await productSchema.findOne({product_id});
  let user = await userSchema({formatted_number:sender});
    if(product_ ) {
      let { stock  , properties , price , title , currency , product_id } = await product_;
      if(!stock){
        return await socket.sendMessage(sender , 'Out Of Stock.');
      }

      //Defines Quantity Selectors
      let limit = stock > 10? 10 : stock;
      let quantity_sections:any[] = [
        {
          title : translated.select_quantity(),
          rows : []
        }
      ]
        
        for(let i = 1; i<= limit ; i++){
          let __ = {title:String(i) , rowId:`${product_id}_quantity_${i}_order` };
          quantity_sections[0]!.rows!.push(__)
        }      
        let custom_order = {title:'10+' , rowId:`${product_id}_quantity_custom_order` }
       await update_buy_order(sender.replace(Prefix,'') , product_id , 'quantity' , '1')
      stock > 10 ? quantity_sections[0]!.rows!.push(custom_order):null;
      let quantity_list = {
        title: translated.select_quantity(),
        text: `${translated.of()} : ${title}`,
        footer: translated.default()+' *1*',
        buttonText: translated.options(),
        sections: quantity_sections
      }


    //Defines Properties Selectors
    
    if(properties.length){
      let properties_sections:any[] = [];
      for(let i of Object.keys(properties[0]) ){
         let temp:any = {
           title: i,
           rows: []
         }
         console.log(i)
         console.log(properties[0])
         let iterables:any = []
         if(typeof properties[0][i] === 'string'){
          iterables = properties[0][i].split(',')
         }else{
          iterables = properties[0][i]
         }
        for( let j of iterables){
          let temp_rows:any;
          
          if(iterables.indexOf(j) === 0){
            temp_rows = {
              title: j, rowId: `${product_id}_${temp.title.toLowerCase()}_${j}_order`, description: translated.default()
            }
          await update_buy_order(sender.replace(Prefix,'') , product_id , temp.title.toLowerCase() , j)
          }
          else{
          temp_rows = {
            title: j, rowId: `${product_id}_${temp.title.toLowerCase()}_${j}_order`
          }
        }
          await temp.rows.push(temp_rows);
        }
        properties_sections.push(temp);
      }
      let properties_list = {
        text: `Of : ${product_.title}`,
        title: translated.available_options(),
        buttonText: translated.options(),
        sections: properties_sections
      }
      console.log(properties_list)
      await socket.sendMessage(sender , properties_list);      
    }

      await socket.sendMessage(sender , quantity_list);
      

     let payment_sections:any[] = [{
       title:translated.payment_mode(),
       rows:[
           {rowId:`${product_id}_paymentMode_credit_order` , title:'Credit card' , description:'Mastercard/Visa'},
           {rowId:`${product_id}_paymentMode_debit_order` , title:'Debit card' , description:'Mastercard/Visa'},
           {rowId:`${product_id}_paymentMode_alipay_order` , title:'Alipay'}
       ]
     }];

     let payment_list:any = {
       title: translated.payment_mode(),
       text: title,
       buttonText: translated.options(),
       footer: translated.default()+' *Alipay*',
       sections: payment_sections
     }
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'paymentMode' , 'Alipay');
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'Price' , `${price}` , price);
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'Title' , title);
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'product_id' , product_id);
       await socket.sendMessage(sender , payment_list);

       let message = {
         text: `*${translated.have_referral()}*`,
         buttons: [{
           buttonId: `${product_id}_coupon`, buttonText: { displayText: btn_text['Coupon code'][LANG] }, type: 1
         }],
         headerType: 4
       }
     await socket.sendMessage(sender , message);

if(!multiple){
       let buttons = [
            {buttonId : `${user.user_id}_invoice` , buttonText:{displayText:btn_text['Generate Invoice'][LANG]} ,type:1 }
            ];
            let invoice_message = {
              text:translated.proceed_invoice(),
              buttons,
              headerType:4
            };
            await socket.sendMessage(sender , invoice_message);
          }
}

}

const multi_purchase_options = async(socket:any , sender:string)=>{
    await userSchema.findOne({formatted_number:sender}).populate('cart').exec(async (error:any , items:any)=>{
        let products_ = await items.cart;
        if(products_.length){
            for(let i of products_){
              await purchase_options(socket , sender , i.product_id , true);
              await socket.sendMessage(sender , {text:`${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}`})
            }
            let buttons = [
            {buttonId : `${items.user_id}_invoice` , buttonText:{displayText:'Generate Invoice'} ,type:1 }
            ];
            let message = {
              text:'Proceed to Invoice',
              buttons,
              headerType:4
            };
            await socket.sendMessage(sender , message);
        }
    })
}

const prompt_for_address = async(socket:any , formatted_number:string , fromInvoice:boolean=true)=>{
    let buttons = [
      { buttonId: 'address_location', buttonText: { displayText: btn_text[`Live Location`][LANG] }, type: 1 },
      { buttonId: 'address_manual', buttonText: { displayText: btn_text[`Enter Address Manually`][LANG] }, type: 2 }
    ]

    let text = translated.ask_address();

    await socket.sendMessage(formatted_number , {
      text,
      buttons,
      footer:'Choose one',
      headerType:4
    })
}

const prompt_for_location = async(socket:any , formatted_number:string, fromInvoice:boolean=true)=>{
  let state_ = read_states(formatted_number);
      let image_prefix = './static/location_steps/';
      let text = translated.location_demo();
      state_.waiting_for = 'address_location';
      write_states(formatted_number , state_);
      await socket.sendMessage(formatted_number , {text});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step1.jpeg`},caption:'Step 1'});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step2.jpg`},caption:'Step 2'});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step3.jpg`},caption:'Step 3'});
}

const save_location = async( socket:any , formatted_number:string , message:any , fromInvoice:boolean=true)=>{
  let state_ = read_states(formatted_number);
  let { longitude , latitude , name , address} = message;
  let user = await userSchema.findOne({formatted_number});
  user.location = {longitude , latitude};
  user.address.text = address;
  await user?.save();
  state_.waiting_for = 'address_location_house';
  write_states(formatted_number , state_);
  await socket.sendMessage(formatted_number , {text:translated.ask_house()});
}

const save_location_house = async( socket:any , formatted_number:string , message:any , fromInvoice:boolean)=>{
  let state_ = read_states(formatted_number);
  let user = await userSchema.findOne({formatted_number});
  user!.address!.house = message;
  user.hasAddress = true;
  await user?.save();
  state_.waiting_for = '';
  write_states(formatted_number , state_);
  await socket.sendMessage(formatted_number , {text:translated.address_saved()});
  if(fromInvoice){
    return generate_receipts(socket , formatted_number);
  }
}

const get_address = async(socket:any , sender:string , invoicing:boolean=false)=>{
      let state_ = read_states(sender);
      state_.waiting_for = 'address_manual';
      write_states(sender , state_);
      await socket.sendMessage(sender , {text:translated.enter_address(),
    footer:'e.g.:H-77\nHamilton Plaza\nChenzi Road\nHong Kong Island'
  })
}

const set_address = async(socket:any , sender:string , address:any , invoicing:boolean=false)=>{
  let state_ = await read_states(sender);
  
  state_.address={
    text:address
  }
  state_.waiting_for = 'general';
  write_states(sender , state_);
  let user = await userSchema.findOne({formattedNumber:sender});
  if(user){
  user!.address={
    text:address,
  };
  user.hasAddress = true;
  await user!.save()
  
}
  write_states(sender.replace(Prefix, ''), state_);
  console.log(state_)
  await socket.sendMessage(sender , {text:translated.address_saved()});
  if(invoicing){
    await generate_receipts(socket , sender);
  }
}



const generate_receipts = async(socket:any , sender:string )=>{
  
  let state_ = await read_states(sender);
  let user_data = await userSchema.findOne({formatted_number:sender});

  if(!user_data!.hasAddress! && !Object.keys(state_).includes('address')){
    state_.waiting_for = 'address_option';
    write_states(sender , state_);
    return prompt_for_address(socket , sender,true);
    }
  let invoice = `*Order Invoice :*\n`;
  let quantity;
  let {order , price , currency} = state_;
  if(Object.keys(order).length){
    for(let o in order){
    quantity = Number(order[o]['quantity']);
      for(let i of Object.entries(order[o])){
        if(i[0].toLowerCase() === 'title'){
              invoice+=`*Product:* ${i[1]}\n`
            }
      }
      for(let i of Object.entries(order[o])){
        if(i[0].toLowerCase() !== 'title' && i[0].toLowerCase() !== 'product_id'){
                  invoice+=`*${i[0]}:* ${i[1]}\n`
                }
      
      }
      invoice+=`${emoji.divider.repeat(9)}\n\n`
      
    }
  }
  console.log(quantity)
  invoice+=`*Gross Price*: ${currency} ${price * quantity}`
  await socket.sendMessage(sender , {
    text:invoice,
    buttons:[
    {
      buttonId:'payment_generate_link', buttonText:{displayText:btn_text['Proceed to Pay'][LANG]} , type:2
    }],
    headerType:4
  })
}


const generate_qrcode = async(socket:any , formatted_number:string )=>{
  let state_ = read_states(formatted_number);
  let { order , price , currency } = state_;
  
  let payment_methods:any = [];
  let line_items:any = [];
  let user = await userSchema.findOne({formatted_number});
  let {_id , pushname , number , address , location} = user;
  let user_address;
  console.log(location)
  if((typeof location === 'object' && Object.keys(location).length && location.longitude! && location.latitude!)){
  	user_address= {
  	hasLocation:true,
  	house:address.house! || "Not found",
  	...location,
  	};
  }else{
  	user_address = {
  		hasLocation:false,
  		...address
  	}
  }

  let metadata:any = {
    	 address:JSON.stringify(user_address),
      id:_id,
      name:pushname,
      info:'',
      number:number,
      customer:formatted_number
  };
  let sale_information:any = [];
 for(let i in order){
   let price_ = await stripe.prices.create({
     unit_amount:Math.round(order[i].Price*100),
     currency:currency,
     product_data:{
       name:order[i].Title,
     }
   });

   await line_items.push({
     price:price_.id,
     quantity:order[i].quantity
   });
   if(!payment_methods.includes(order[i].paymentMode.toLowerCase())){
     payment_methods.push(order[i].paymentMode.toLowerCase() === 'alipay'?'alipay':'card');
   }
   let product = await productSchema.findOne({product_id:i});
   if(product){
  
   let seller = await sellerSchema.findOne({products_uploaded:product._id});
   console.log('Seller Details' , seller)
   if(!seller){
   	return await socket.sendMessage(formatted_number , {text:translated.product_unavailable()})
   	}
   let { sizes , size ,  colors , color , variations , variation} = order[i];
   sale_information.push({
    product:product._id,
    soldBy:seller!._id,
    quantity:order[i].quantity,
    properties:{colors:colors||color,variations:variations||variation,sizes:sizes||size}
   })
  }
 }
 metadata.info = JSON.stringify(sale_information);

 
  let payment_link = await stripe.paymentLinks.create({
    line_items,
    payment_method_types:payment_methods,
    metadata,
    after_completion:{
    	redirect:{
    		url:"https://wa.me/85262594255"
    	},
    	type:"redirect"
    }
  });
  
console.log(metadata)

  if(payment_link.url){
    if(payment_methods.includes('card')){
      await socket.sendMessage(formatted_number , {
        text:`${payment_link.url}\n${translated.pay()}`
      });
    }else{
      let qr_name = `./qrcodes/${formatted_number.replace(Prefix,'')}_${new Date().getTime()}.png`;
      await qrcode.toFile(qr_name , payment_link.url,async(e)=>{
        console.log(qr_name)
        if(process.env.NODE_ENV === 'prod'){
      await socket.sendMessage(formatted_number , {
        image:{url:qr_name , mimetype:'image/png'},
        caption:"Please Scan from Alipay",
        buttons:[
        {buttonId:"cancel_order" , buttonText:{displayText:btn_text["Cancel order"][LANG]} , type:1}
        ],
        headerType:2
      })
        }else{
      await socket.sendMessage(formatted_number , {text:payment_link.url});
    }
    })
    
    }
  }else{
    await socket.sendMessage(formatted_number , {
      text:translated.link_error()
    })
  }
  state_.order = [];
  state_.price = null,
  write_states(formatted_number, state_)
}

const confirm_delivery_customer = async (socket:any , formatted_number:string , invoice_number:string)=>{
	
	let order_data =  await order_models.findOne({invoice_number}).populate({path:'products.product'}).populate('ordered_by').populate('seller');
	let { products , seller , ordered_by } = order_data;
	await console.log(ordered_by)

if(ordered_by){
	order_data.order_status = 'completed';
	await order_data.save();
	let user = await userSchema.findOne({number:ordered_by.number});
	
		if(user.score){
			user.score = Number(user.score) + 10
			}else{ user.score = 10 } ;
		
		await user.save();
	
	await socket.sendMessage(user.formatted_number , {
		image:{url:'./Seller_bot/static/confirm_delivery_rewards.jpg'},
		caption:`Thank you for your Confirmation*,\nYou receive *+10* Points ${emoji.finger_heart}\nRemember, with each Confirmation of order, You get Closer to Amazing Coupons and Discounts ${emoji.angel_face}\n\nCurrent Rewards list:\n*Epic Coupon code*: (score :50)\n*Special privileged Discounts*: (score:90)\n${emoji.stars} *Legendary Coupon Code* ${emoji.stars}: (score:120)`,
		footer:`Current Score: ${user.score}\n note:Scores gets reset after 45 days`,
		headerType:2
	});

	return await socket.sendMessage(user.formatted_number , {
		image:{url:products.image},
		caption:`You may Leave a review for this product\nTitled:*${products.title.trim()}*\nWould love to have your feedback`,
		footer:`If you do not wish to leave a review right away, you can come back anytime later\nbut before 45 days`,
		buttons:[
		{buttonId:`review_add_${products[0].product._id}_${user._id}_${new Date(new Date().getTime()+60*60*60*400*45).getTime()}`,buttonText:{displayText:"Add review"},type:1}
		],
		headerType:2
	})
}

}

const decline_confirm_delivery = async (socket:any , formatted_number:string , invoice_number:string)=>{
	let order_data =  await order_models.findOne({invoice_number}).populate('ordered_by').populate('seller');
	let { seller , ordered_by } = order_data;
	
	return await socket.sendMessage(formatted_number , {
	text:translated.query_to_seller([seller.number , invoice_number]),
	buttons:[
	{button_id:`feedback_${invoice_number}_${ordered_by._id}`,buttonText:{displayText:"Feedback"},type:1},
	{button_id:`complaint_${invoice_number}_${ordered_by._id}`,buttonText:{displayText:"Complaint"},type:1}
	]
	})
}

const save_feedback = async (socket:any , formatted_number:string , button_id:string , feedback:string)=>{
	let details = button_id.split('_');
	let [Type, invoice_number , user_id] = details;
	let {_id} = await order_models.findOne({invoice_number},{_id:1});
	let new_feedback = new feedbackSchema({
		Type,
		order:_id,
		user:user_id,
		feedback
	});
	new_feedback = await new_feedback.save()

	if(Type === 'complaint'){
		let order_details = await order_models.findOne({invoice_number}).populate({path:'products.product'}).populate('ordered_by').populate('seller');
		let { products , seller , ordered_by } = order_details;
		await socket.sendMessage(formatted_number,{text:translated.issued_complaint()})
		let ps = spawn('python3' , ['email_utility.py','Received Complaint',`We have received a complaint<br/>Id: ${new_feedback._id}<br/>User: ${ordered_by.name}<br/>Number: ${ordered_by.number}<br/><b>Against:</b><br> Seller: ${seller.name} - ${seller.number}<br/>Invoice Number: ${invoice_number}`,'logicredefined@gmail.com'])
	}
}
//
const add_rating = async(socket:any , formatted_number:string , product_id:string , rating:number , )=>{
	let state_ = read_states(formatted_number);
	let user_ = await userSchema.findOne({formatted_number});
	let product_ = await productSchema.findOne({product_id});
	let id = shortid.generate();
	
	state_['reviews'] = {
		product_id,
		id,
		user:user_._id,
		rating
	}
	product_.reviews.length ? null : product_.reviews = [];
	product_!.reviews!.push({
		id,
		user:user_!._id,
		user_name:user_!.pushName,
		rating
 })
		
	await product_.save();
	state_.waiting_for = `review_content`;
	write_states(formatted_number ,state_);
	
	await socket.sendMessage(formatted_number , {
		text:`Kindly Enter your Reviews for the product now` ,
		buttons:[{button_id:`cancel_review` ,buttonText:{displayText:'cancel'} , type:1 }]
		});
}

const add_review = async(socket:any , formatted_number:string , review:number , )=>{
	let state_ = read_states(formatted_number);
	let {product_id , id } = state_.reviews;
	let user_ = await userSchema.findOne({formatted_number});
	let product_ = await productSchema.findOne({product_id});
	if(product_){
	let { reviews } = product_;
	
	let current_review = reviews.findIndex(i=> i.id === id);
	if(current_review === -1){
		product_.reviews.push({
		id,
		user:user_!._id,
		user_name:user_!.pushName,
		content:review
		});
		await product_.save();
		user_.reviews.push(id);
		await user_.save();
		
	product_.reviews[current_review]['content'] = review;
	
	await product_.save();
	await socket.sendMessage(formatted_number , {
		text:`Review Added\n*${product_.title}\n=>${review}\n${emoji.star.repeat(product_.reviews[current_review].rating)}`
		});
	await show_menu(socket , formatted_number);
	}
 else{await socket.sendMessage(formatted_number , {text:"Sincere Apologies , something went wrong in adding review of the product, We're looking into this as fast as we could"})}
}
	}
const show_review = async(socket:any , formatted_number:string , product_id:string , start:number=0)=>{
	let product_ = await productSchema.findOne({product_id});
	if(!product_.reviews.length){
		return await socket.sendMessage(formatted_number , {text:"No reviews given yet"});
	}
	let reviews_present = product_.reviews.slice(start*10 , (start*10 + 10)).length;
	if(!reviews_present){
		return await socket.sendMessage(formatted_number , {text:"No more reviews"});
	}
	await socket.sendMessage(formatted_number , {
		text:`Reviews of \n*${product_.title}`
		});
	for(let p of product_.reviews.slice(start*10 , start*10+10)){
		let { user_name , content , rating } = p;
		await socket.sendMessage(formatted_number , {text:`${emoji.star.repeat(rating)}\nFrom *${user_name.trim()}*:\n${content}`});
	}
	if(reviews_present){
		return await socket.sendMessage(formatted_number , {
			text:emoji.divider.repeat(9),
			buttons:[
			{buttonId:`show_reviews_${product_id}_${start+1}`,buttonText:{displayText:`More ${emoji.next_arrow}`},type:1}
			]})
		}
}	

const show_menu = async(socket:any , number:string)=>{
  const buttons = [
    { buttonId: `categories`, buttonText: { displayText: btn_text[`Categories`][LANG] }, type: 2 },
    { buttonId: 'all', buttonText: { displayText: btn_text[`All Products`][LANG] }, type: 1 },
    { buttonId: 'cart', buttonText: { displayText: btn_text[`Cart`][LANG] }, type: 1 },
    
    { buttonId: 'menu', buttonText: { displayText: btn_text[`Menu`][LANG] }, type: 1 }
  ]
    
      const buttonMessage = {
        text: translated.menu(),
        buttons: buttons,
        footer:translated.menu_instructions(),
        headerType: 2
      }
      await socket.sendMessage(number , buttonMessage)
}

const show_category = async(socket:any , number:string)=>{
  let state_ = read_states(number.replace(Prefix,''));

  let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
  if(!categories){
    await socket.sendMessage(number , 'No Categories Available , try searching for products')
  }
let sections:any = [{
		title:"Main Categories",
		rows:[]
		}];

  for(let c of categories){
     let message = {
       image: { url: c.image },
       caption: `*${c.name}*`,
       buttons: [{
         buttonId: c.name, buttonText: { displayText: c.name }, type: 1
       }],
       headerType: 2
     }
	sections[0].rows.push({
		title:c.name!, rowId:c.name!
		});
    state_.pagination.page = 1;
    write_states(number.replace(Prefix,''),state_)
     await socket.sendMessage(number , message);
     await wait(.2);
  }
  
  await socket.sendMessage(number , {
		  text: "*All Categories*",
  title: "A portable list of all categories",
  buttonText: "Show",
  sections  	
  	})
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

  const socket = makeWASocket({
    logger,
    printQRInTerminal: true,
    auth: state
  });
  store?.bind(socket.ev);

  socket.ev.on('connection.update', async () => {
  
    await saveCreds();

  });

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
          orders: {}, pagination: {
            page: 1,
            offset: 3
          }
        }))
      }

      let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
      let DP;
      try{
      DP = await socket.profilePictureUrl(formatted_number,'image');
    }catch(e){
      console.log(e)
    }
      if(!user){
            user  = await new userSchema({
              pushname:sender.pushName,
              user_id:shortid.generate(),
              number:formatted_number.replace(Prefix,''),
              profile_picture:DP,
              formatted_number:formatted_number,
              cart:[]
            });
            user = await user.save();
            console.log(user)
             
    
      const buttonMessage = {
        text: translated.greetings([sender.pushName , emoji]),
        headerType: 1
      }
      await socket.sendMessage(formatted_number , buttonMessage);
      await show_menu(socket , formatted_number)
          }
      
      
      let user_state = await read_states(user.number);
      console.log(user_state)

    if(message.messages.length){

//        if(Object.keys(sender!.message!).includes('extendedTextMessage')){
//          if(Object.keys(sender!.message!.extendedTextMessage!).includes('contextInfo')){
//            let content = sender!.message!.extendedTextMessage!;
//            console.log(content)
//            if(content!.contextInfo!.quotedMessage!.conversation === "=>reply for Address"){
//
//              await set_address(socket , formatted_number , content.text , true)
//            }
//          }
//        }
	let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
      if(message.messages[0].message){
          let content , buttonResponse;
          if(Object.keys(sender!.message!).includes('conversation')){
          content = String(sender!.message!.conversation!);
          let state_ = read_states(formatted_number);
          console.log(content)
          if(state_.waiting_for === 'address_location_house'){
            await save_location_house(socket , formatted_number , content , true)
          }
          if(state_.waiting_for === 'address_manual'){
            await set_address(socket , formatted_number , content , true);
          }
          if(['all','å…¨éƒ¨'].includes(content.toLowerCase().trim())){
            await show_products(socket , formatted_number , 1 )
          }
        if(content.toLowerCase().trim() === 'products'){
                await show_products(socket , formatted_number , 1 );
        }
        if(["hi","hii","hiiii","hey",".","hiya", "hello", "menu", "chao", "yo","ä½ å¥½ è²·" , "ä½ å¥½" , "è²·"].includes(content.toLowerCase().trim())){
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
            await remove_from_cart(socket , formatted_number , content.selectedButtonId!)
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
              await prompt_for_location(socket , formatted_number)
            break;
            case btn_text['Enter Address Manually'][LANG]:
              await get_address(socket , formatted_number , true)
            break;
            case btn_text['Proceed'][LANG] :
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_);
            await multi_purchase_options(socket , formatted_number);
            break;

            case btn_text['Generate Invoice'][LANG]:
            await generate_receipts(socket , formatted_number )
            break;

            case btn_text['Proceed to Pay'][LANG]:
            await generate_qrcode(socket , formatted_number);
            break;

            case btn_text['Cancel order'][LANG]:
            await socket.sendMessage(formatted_number , {text:'Order Canceled'});
            await show_menu(socket, formatted_number);
            break;

            case 'Feedback':
            await save_feedback(socket, formatted_number , content.selectedButtonId! , content);
            break;

            case 'Complaint':
            await save_feedback(socket, formatted_number , content.selectedButtonId! , content);
            break;
          }

          
		let ids = content.selectedButtonId!.split('_');

		if(ids[0] === 'notify'){
			if(ids[1] === 'customer'){
				if(ids[2] === 'yes'){
					await confirm_delivery_customer(socket , formatted_number , ids[3]);
				}
				else{
					await decline_confirm_delivery(socket , formatted_number , ids[3]);
				}
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

          for( let category of categories){
            if(String(content.title) === String(category.name)){
              
              return await show_categorised_products(socket , formatted_number , category.name , 1)
            }
          }
          
          let details = content.singleSelectReply!.selectedRowId!.split('_');
          console.log(details);
          let product__ = await productSchema.findOne({product_id:details[0]});
          if(!product__){ await socket.sendMessage(formatted_number, {text:translated.product_error()})};

          let states = await read_states(formatted_number.replace(Prefix,''));
          let {order} = states;

          if(details[3] === 'order'){
          await update_buy_order(formatted_number.replace(Prefix,'') , details[0] , details[1] , details[2])
           
          await socket.sendMessage( formatted_number, {text:`Selected ${content.title} as ${details[1]}`})
          }

        //   switch(content.singleSelectReply!.selectedRowId!){
        //     case '':
        //     break;
        // }
        
  }
  
  else if(Object.keys(sender!.message!).includes('locationMessage')){
    content = sender!.message!.locationMessage;
    let state_ = read_states(formatted_number);
    if(state_.waiting_for === 'address_location'){
        await save_location(socket , formatted_number , {latitude:content.degreesLatitude,longitude:content.degreesLongitude , name:content.name , address:content.address})
    }else{
      await socket.sendMessage(formatted_number , {text:translated.location_error()})
    }
  }
  else if(Object.keys(sender!.message!).includes('templateButtonReplyMessage')){
  	let content = sender!.message!.templateButtonReplyMessage;
  	let button_id = content!.contextInfo.quotedMessage!.templateMessage!.hydratedFourRowTemplate!.hydratedButtons!;
  	let selectedIndex = content!.selectedIndex!;

  	let selectedButton = button_id![selectedIndex!].quickReplyButton!.id;
  	if(selectedButton){
  		let selectedButtonId = selectedButton.split('_');
  		if(selectedButtonId[0] === 'notify' && content!.selectedDisplayText === 'yes'){
  			
					return await confirm_delivery_customer(socket , formatted_number , selectedButtonId[1]);
				}
				else{
					return await decline_confirm_delivery(socket , formatted_number , selectedButtonId[1]);
				}
  		}
  	}
  redis.on('message',(channel:string , message:any)=>{
//  	console.log('Coming from inside the sock',channel ,message);
//  	socket.sendMessage('919654558103@s.whatsapp.net',{text:message})
  })
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
  
  redis.on('message',async (channel:string , message:any)=>{
    console.log(channel)
    if(channel === 'payment_status_channel'){
      let parsed_message = JSON.parse(message);
      
      let {order_details , customer , number , info} = parsed_message;
      
      
      
      let { products , multi_seller , seller } = order_details._doc; 
      
//	      let ps = spawn('python3' , ['email_utility.py','Failed to furnish order Details',`Invoice Number: ${order_details!._doc!.invoice_number!}<br/> Please look into it urgently`,'logicredefined@gmail.com'])
//	      return  await client.sendSimpleMessage(number , {text:`Order Placed for Dispatch`});
	  let saleInformation = JSON.parse(info);
      let products_:any = [];
      let product_details = "";
      for (let p of saleInformation){
      	let item = await productSchema.findOne({_id:p.product})
 		console.log(item.title,new Date());
 		product_details+=`*${item.title}*`;
      }
      console.log(product_details,new Date());
      
      if(!parsed_message.success){
      	let ps = spawn('python3' , ['email_utility.py', 'Payment Intent Failed',`Invoice Number: ${order_details!._doc!.invoice_number!}<br/> Please verify the matter as soon as possible`,'logicredefined@gmail.com'])
      	return await client.sendSimpleMessage(number , {text:translated.payment_error()})
      }
     
      !multi_seller.length ? product_details+=`\nSold By: ${seller.shop_name}\nContact Info: ${seller.number}\n\n` : product_details+=`\nSold By: Multiple Different sellers`;
      
       await client.sendSimpleMessage(number , {
text:`${translated.order_placed()}
Invoice ID:${order_details!._doc!.invoice_number!}\n
${products_.length > 1?'Items':'Item'}:
${product_details}

${translated.will_inform()}`
		})
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
		
		if(target === 'seller'){
			if(delivery_status.toLowerCase() !== 'en-route' && delivery_status.toLowerCase() !== 'delivered'){
				
			let buttons = [
			{button_id:'notify_seller_yes' , button_text: {displayText:"Yes"}, type:1},
			{button_id:'notify_seller_no' , button_text: {displayText:"No"}, type:2},
			]

			await client.sendSimpleMessage(seller.number , {
				text:`Hello\nWe got to know that you haven't Updated status of\nOrder No. *${invoice}*\nItems: ${products.map(i=>`*${i.product.title}*`)}\n Ordered By:${ordered_by.pushName}\n\n_Have you Dispatched / Delivered this order yet_?`,
				buttons,
				headerType:2
				});
		}
		}
		if(target === 'customer'){
			let buttons = [
			{button_id:'notify_customer_yes_${invoice}' , button_text: {displayText:"Yes"}, type:1},
			{button_id:'notify_customer_no_${invoice}' , button_text: {displayText:"No"}, type:2},
			];
			let buttons_ = [
			{button_id:'notify_customer_yes_${invoice}' , button_text: {displayText:"Yes"}, type:1},
			{button_id:'notify_customer_no_${invoice}' , button_text: {displayText:"No"}, type:1},
			]
			

				await client.sendSimpleMessage(ordered_by.number , {
//				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
				text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice}_\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
				footer:"It is best to respond to this question as this will help us keep track of your delivery status",
				templateButtons: [
            {index:1, quickReplyButton: {displayText: `Yes`},id:`notify_${invoice}`,type:1},
              {index:2, quickReplyButton: {displayText: `No`}, id:`notify_${invoice}`,type:1 }
              ]
            
				
				});
			
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
      let order_details = await order_models.findOne({invoice_number})
      .populate('ordered_by')
		.populate('seller')
		.populate({path:'products.product'});
		
      if(order_details){
      let products = `${order_details!.products.length > 1?'Items':'Item'}:\n${order_details!.products.map(i=>`*${i.product.title}*\n`)}`;
      if(delivery_status.toLowerCase() === 'en-route'){
      	client.sendSimpleMessage(order_details.ordered_by.number , {text:translated.product_dispatched([order_details , emoji])})
      }
      if(delivery_status.toLowerCase() === 'delivered'){
      let buttons = [
			{button_id:'notify_customer_yes_${invoice_number}' , button_text: {displayText:"Yes"}, type:2},
			{button_id:'notify_customer_no_${invoice_number}' , button_text: {displayText:"No"}, type:2},
			]

			await client.sendSimpleMessage(order_details.ordered_by.number , {
//				text:`Hello\nDo you have any Queries/Issues regarding your Order No. *${invoice_number}*\nItems: ${products.map(i=>`*${i.product.title}*`)}`,
				text:`${translated.query_question()}\n_Details_ :\n*Order No.* _${invoice_number}_\nItems: ${order_details.products.map(i=>`*${i.product.title}*`)}`,
				buttons,
				headerType:2
				});
		}
      }
      }
    })
    
  })()

//   const MessageSended = await client.sendSimpleMessage( 'Sent from Baileys' , '919654558103');
// console.log(JSON.stringify(MessageSended, undefined, 2));


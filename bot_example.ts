import { Boom } from '@hapi/boom';
import { config } from 'dotenv';
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState , proto } from '../src';
import MAIN_LOGGER from '../src/Utils/logger';
import { read_states , write_states , wait , Prefix , write_logs } from './utilty_methods';
import mongoose, { Mongoose } from 'mongoose';

import fs, { read } from 'fs';
import path, { format } from 'path';

require('dotenv').config();
const stripe = (require('stripe'))(process.env.STRIPE_KEY);
import os from 'os';
import shortid from 'shortid';
const qrcode = require('qrcode');
import productSchema from './models/product_model';
import userSchema from './models/user_model';
import sellerSchema from './models/seller_model';
import Redis from 'ioredis';
import order_models from './models/order_models';

// import {proto } from '@adiwajshing/baileys/WAProto'
const logger = MAIN_LOGGER.child({});
logger.level = 'silent';
const redis = new Redis();
redis.subscribe('payment_status_channel');
redis.subscribe('order_status_channel');

const emoji = JSON.parse(fs.readFileSync('./emoji.json','utf8'))

config();
var session = module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);
console.log(session)


//==============All Products===========================================================================
const show_products = async(socket:any ,formatted_number:string , start:number ) =>{
  let state_ = read_states(formatted_number);
  state_.pagination.page = start;
  let { offset , page } = state_.pagination;
//  state_.pagination.offset = offset || 5;
  let skip = offset * ( Number(page) - 1 );

  write_states(formatted_number , state_)
      const products = await productSchema.find({}).limit(offset).skip(skip===1?0:skip)
      
      console.log(products.length);

      const total_products = await productSchema.countDocuments();
      
      for(let product of products){
    
      const buttons = [
        { buttonId: `${product.product_id}_buy`, buttonText: { displayText: `Buy` }, type: 1 },
        { buttonId: `${product.product_id}`, buttonText: { displayText: `Add to cart` }, type: 2 },
        { buttonId: `${product.product_id}__reviews`, buttonText: { displayText: `Reviews` }, type: 3 }
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
          buttonId:'all_products' , buttonText:{displayText:`Next${emoji.next_arrow}`} , type:1
        }],
        headerType:1
      }
      let prevButton = {
       text:`Go To Page: ${Number(page)-1}`,
        buttons:[{
          buttonId:'all_products' , buttonText:{displayText:`${emoji.prev_arrow}Prev`} , type:1
        }],
        headerType:1
      }
      let paginate_buttons = {
        text:`Go To Page: ${Number(page)-1} or Go To Page: ${Number(page)+1}`,
        buttons:[{
          buttonId:'all_products' , buttonText:{displayText:`${emoji.prev_arrow}Prev`} , type:2
        },{
          buttonId:'all_products' , buttonText:{displayText:`Next${emoji.next_arrow}`} , type:2
        }],
        headerType:1
      }
      console.log(total_products - ((page)*offset))
      if(page === 1 && total_products - ((page-1)*offset) >= offset){
        await socket.sendMessage(String(formatted_number) , nextButton)
      }
      else if(page > 1 && total_products - ((page-1)*offset) < offset){
        prevButton.text = `No more Products Present\nGo To Page: ${Number(page)-1}`
          await socket.sendMessage(String(formatted_number) , prevButton);
      }
      else if(page === 1 && total_products - ((page-1)*offset) < offset ){
  
      }
      else{
       await socket.sendMessage(String(formatted_number) , paginate_buttons) 
      }
  }


//=============Categorised products=====================================================
const show_categorised_products = async(socket:any , sender : string , category : string , start:number) =>{
      const states = await read_states(sender);
      states.pagination.category = category;
      states.pagination.page = start;
      write_states(sender, states)
      let { page , offset } = states.pagination;
      let start_page = page > 1 ?
           		   Number( page - 1) * offset : 1 ;
      
      const products = await productSchema.find({category}).limit(offset || 5).skip( page - 1 )
	 const total_products = await productSchema.countDocuments();
      console.log(products.length);
      
      				
      for(let product of products){
    
         const buttons = [
           { buttonId: `${product.product_id}_buy`, buttonText: { displayText: `Buy` }, type: 1 },
           { buttonId: `${product.product_id}`, buttonText: { displayText: `Add to cart` }, type: 2 },
           { buttonId: `${product.product_id}__reviews`, buttonText: { displayText: `Reviews` }, type: 3 }
         ]

      const buttonMessage = {
        image: { url: product.image.startsWith('http') ? product.image : `./Seller_bot/${product.image.replace('./', '')}` },
        caption: `*${product.title.trim()}*
${product.description.split(' ').slice(0,50).join(' ')+'\n\n\n'+product.description.split(' ').slice(0,50).join(' ')}`,
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
    await delay(200)
      }
      
    let nextButton = {
      text:`Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:category , buttonText:{displayText:`Next${emoji.next_arrow}`} , type:1
      }],
      headerType:1
    }
    let prevButton = {
     text:`Go To Page: ${Number(page)>1?Number(page)-1:Number(page)}`,
      buttons:[{
        buttonId:category , buttonText:{displayText:`${emoji.prev_arrow}Prev`} , type:1
      }],
      headerType:1
    }
    let paginate_buttons = {
      text:`Go To Page: ${Number(page)-1} or Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:category , buttonText:{displayText:`${emoji.prev_arrow}Prev`} , type:2
      },{
        buttonId:category , buttonText:{displayText:`Next${emoji.next_arrow}`} , type:2
      }],
      headerType:1
    }
    
    console.log(total_products - ((page)*offset))
    if(page === 1 && total_products - ((page)*offset) >= offset){
      await socket.sendMessage(String(sender) , nextButton)
    }
    else if(page > 1 && total_products - ((page-1)*offset) < offset){
        await socket.sendMessage(String(sender) , prevButton)
    }
    else if(page === 1 && total_products - ((page-1)*offset) < offset ){

    }
    else{
     await socket.sendMessage(String(sender) , paginate_buttons) 
    }
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
  	return
  }
  states.pagination.page-=1;
  write_states(sender, states);
  if(buttonId === 'all_products'){
    return await show_products(socket , sender , states.pagination.page)
  }
  let {category , page} = states.pagination;
  return await show_categorised_products(socket , sender , category , page)
};

const add_to_cart = async(socket:any , sender:string , id:string)=>{
      let user_ = await userSchema.findOne({formatted_number : sender});
      let product = await productSchema.findOne({product_id:Number(id)});
      if(!product){
        return await socket.sendMessage(sender , {text:'Selected product not found in stock, please try again later'});
      }
      console.log(product)
      await user_.cart.push(product._id);
      await user_.save();
      let cart_buttons = [{
        buttonId:'cart',buttonText:{displayText:'Show cart' , type:1}
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
        buttonId: 'cart', buttonText: { displayText: 'Show cart' }, type: 1
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
            { buttonId: 'categories', buttonText: { displayText: 'categories' }, type: 1 }
          ]
          let buttonMessage = {
            text: 'Oops, your cart seems completely empty and sad, Try adding some products in here to make it happy',
            buttons: buttons,
            headerType: 4
          }
          return await socket.sendMessage(sender , buttonMessage);
        }
        for(let i of products_){
          let buttons = [
            { buttonId: i.product_id + '_buy', buttonText: { displayText: 'Buy This only' }, type: 1 },
            { buttonId: i.product_id, buttonText: { displayText: 'Remove' }, type: 3 }
          ]
          i.image.startsWith('http')?i.image:i.image=`./Seller_bot/${i.image.replace('./','')}`;
          let buttonMessage = {
            image: { url: i.image },
            caption: `${i.title}`,
            footer: `Price: ${i.currency}${i.price}`,
            buttons: buttons,
            headerType: 2
          }
          await socket.sendMessage(sender , buttonMessage);
        }
        let all_costs = await products_.map((i:any)=>i.price)
        let total_cost =await all_costs.reduce((acc:any,cur:any)=>acc+cur)
        let buy_all_message = {
          text: `Proceed to Purchase all \n@ ${total_cost}`,
          buttons: [{
            buttonId: 'purchase_all_from_cart', buttonText: { displayText: 'Proceed' }, type: 1
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
    if(product_ ){
      let { stock  , properties , price , title , currency , product_id } = await product_;
      if(!stock){
        return await socket.sendMessage(sender , 'Out Of Stock.');
      }
      let limit = stock > 10? 10 : stock;

      let quantity_sections:any[] = [
        {
          title : 'Quantity',
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
        title: "Select Quantity",
        text: `Of : ${title}`,
        footer: 'default *1*',
        buttonText: "Options",
        sections: quantity_sections
      }

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
              title: j, rowId: `${product_id}_${temp.title.toLowerCase()}_${j}_order`, description: 'Default'
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
        title: "Available options",
        buttonText: "Options",
        sections: properties_sections
      }
      console.log(properties_list)
      await socket.sendMessage(sender , properties_list);      
    }

      await socket.sendMessage(sender , quantity_list);
      

     let payment_sections:any[] = [{
       title:'Payment mode',
       rows:[
           {rowId:`${product_id}_paymentMode_credit_order` , title:'Credit card' , description:'Mastercard/Visa'},
           {rowId:`${product_id}_paymentMode_debit_order` , title:'Debit card' , description:'Mastercard/Visa'},
           {rowId:`${product_id}_paymentMode_alipay_order` , title:'Alipay'}
       ]
     }];

     let payment_list:any = {
       title: 'Payment Mode',
       text: title,
       buttonText: 'Options',
       footer: 'Default *Alipay*',
       sections: payment_sections
     }
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'paymentMode' , 'Alipay');
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'Price' , `${price}` , price);
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'Title' , title);
     await update_buy_order(sender.replace(Prefix,'') , product_id , 'product_id' , product_id);
       await socket.sendMessage(sender , payment_list);

       let message = {
         text: `*Have a Referral ?*`,
         buttons: [{
           buttonId: `${product_id}_coupon`, buttonText: { displayText: 'Coupon code' }, type: 1
         }],
         headerType: 4
       }
     await socket.sendMessage(sender , message);

if(!multiple){
       let buttons = [
            {buttonId : `${user.user_id}_invoice` , buttonText:{displayText:'Generate Invoice'} ,type:1 }
            ];
            let invoice_message = {
              text:'Proceed to Invoice',
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
      { buttonId: 'address_location', buttonText: { displayText: `Live Location` }, type: 1 },
      { buttonId: 'address_manual', buttonText: { displayText: `Enter Address Manually` }, type: 2 }
    ]

    let text = `You must Update your address before proceeding to Invoice
    in order to do so,
    you can either Share your Location with us through Google maps (in 2 easy steps)
    Or Type in Your complete Address Field by Field;
    `;

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
      let text = 'You can provide your location is 3 very easy steps, showed in these images :';
      state_.waiting_for = 'address_location';
      write_states(formatted_number , state_);
      await socket.sendMessage(formatted_number , {text});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step1.jpeg`},caption:'Step 1'});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step2.jpeg`},caption:'Step 2'});
      await socket.sendMessage(formatted_number , {image:{url:`${image_prefix}step3.jpeg`},caption:'Step 3'});
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
  await socket.sendMessage(formatted_number , {text:"Please enter your House No. as well,\nSo we can deliver at Precisely at your doorstep"});
}

const save_location_house = async( socket:any , formatted_number:string , message:any , fromInvoice:boolean)=>{
  let state_ = read_states(formatted_number);
  let user = await userSchema.findOne({formatted_number});
  user!.address!.house = message;
  user.hasAddress = true;
  await user?.save();
  state_.waiting_for = '';
  write_states(formatted_number , state_);
  await socket.sendMessage(formatted_number , {text:"Address Saved"});
  if(fromInvoice){
    return generate_receipts(socket , formatted_number);
  }
}

const get_address = async(socket:any , sender:string , invoicing:boolean=false)=>{
      let state_ = read_states(sender);
      state_.waiting_for = 'address_manual';
      await socket.sendMessage(sender , {text:`Please Enter your Address in this format\nHouse NO.\nBuilding Name\nStreet Name\nCity\n\nEach filed must be seperated by 'ENTER'`,
    footer:'e.g.:H-77\nHamilton Plaza\nChenzi Road\nHong Kong Island'
  })
}

const set_address = async(socket:any , sender:string , address:any , invoicing:boolean=false)=>{
  let state_ = await read_states(sender);
  let address_list = address.replaceAll(' ','').split('\n');
  if(address_list.length < 3){
    return await socket.sendMessage(sender , {text:`Something wrong with address , Only found ${address_list.length} fields\nPlease provide us your address in the prescribed manner above\nso We can Deliver at your doorstep `})
  }
  state_.address={
    text:address,
    house_number:address_list[0],
    building:address_list[1],
    street:address_list[2],
    city:address_list[3]
  }

  let user = await userSchema.findOne({formattedNumber:sender});
  if(user){
  user!.address={
    text:address,
    house:address_list[0],
    building:address_list[1],
    street:address_list[2],
    city:address_list[3]
  };
  user.hasAddress = true;
  await user!.save()
  if(invoicing){
    generate_receipts(socket , sender);
  }
}
  write_states(sender.replace(Prefix, ''), state_);
  console.log(state_)
  await socket.sendMessage(sender , {text:'Address saved'});
  if(invoicing){
    await generate_receipts(socket , sender);
  }
}



const generate_receipts = async(socket:any , sender:string )=>{
  
  let state_ = await read_states(sender);
  let user_data = await userSchema.findOne({formatted_number:sender});

  if(!user_data!.hasAddress!){
    state_.waiting_for = 'address_option';
    write_states(sender , state_);
    return prompt_for_address(socket , sender);
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
      invoice+=`${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}${emoji.divider}\n\n`
      
    }
  }
  console.log(quantity)
  invoice+=`*Gross Price*: ${currency} ${price * quantity}`
  await socket.sendMessage(sender , {
    text:invoice,
    buttons:[
    {
      buttonId:'payment_generate_link', buttonText:{displayText:'Proceed to Pay'} , type:2
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
  let {_id , pushname , number} = user;
  

  let metadata:any = {
    address : JSON.stringify(state_.address),
      id:_id,
      name:pushname,
      info:'',
      number:number,
      customer:formatted_number
  };
  let sale_information:any = [];
 for(let i in order){
   let price_ = await stripe.prices.create({
     unit_amount:Math.round(price*100),
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
   	return await socket.sendMessage(formatted_number , {text:"This product seems unavailable at the moment, Sorry for inconvenience"})
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
    metadata
  });
console.log(metadata)

  if(payment_link.url){
    if(payment_methods.includes('card')){
      await socket.sendMessage(formatted_number , {
        text:`${payment_link.url}\nPlease continue to pay`
      });
    }else{
      let qr_name = `./qrcodes/${formatted_number.replace(Prefix,'')}_${new Date().getTime()}.png`;
      await qrcode.toFile(qr_name , payment_link.url,async(e)=>{
        console.log(qr_name)
      await socket.sendMessage(formatted_number , {
        image:{url:qr_name , mimetype:'image/png'},
        caption:"Please Scan from Alipay",
        buttons:[
        {buttonId:"cancel_order" , buttonText:{displayText:"Cancel order"} , type:1}
        ],
        headerType:2
      })
    })
    }
  }else{
    await socket.sendMessage(formatted_number , {
      text:"Something went wrong, Could not generate order link :("
    })
  }
  state_.order = [];
  state_.price = null,
  write_states(formatted_number, state_)
}

const show_menu = async(socket:any , number:string)=>{
  const buttons = [
    { buttonId: `categories`, buttonText: { displayText: `categories` }, type: 2 },
    { buttonId: 'all', buttonText: { displayText: `All Products` }, type: 1 },
    { buttonId: 'cart', buttonText: { displayText: `cart` }, type: 1 },
    { buttonId: 'search', buttonText: { displayText: `search` }, type: 1 },
    { buttonId: 'menu', buttonText: { displayText: `menu` }, type: 1 }
  ]
    
      const buttonMessage = {
        text: '*For Manual Commands* \nType\n\n *categories*: \n To see list of all categories of products \n *cart*: \n To look into your cart \n *all*: \n To get list of all products \n *menu*: \n for this message',
        buttons: buttons,
        headerType: 1
      }
      await socket.sendMessage(number , buttonMessage)
}

const show_category = async(socket:any , number:string)=>{
  let state_ = read_states(number.replace(Prefix,''));

  let categories = await JSON.parse(fs.readFileSync('./static/categories.json' , 'utf8'));
  if(!categories){
    await socket.sendMessage(number , 'No Categories Available , try searching for products')
  }


  for(let c of categories){
     let message = {
       image: { url: c.image },
       caption: `*${c.name}*`,
       buttons: [{
         buttonId: c.name, buttonText: { displayText: c.name }, type: 1
       }],
       headerType: 2
     }

    state_.pagination.page = 1;
    write_states(number.replace(Prefix,''),state_)
     await socket.sendMessage(number , message);
     await wait(.2);
  }

}

const store = makeInMemoryStore({logger});
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
  store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

const startSock = async (): Promise<{ sendSimpleMessage: (content: string, number: string)=> Promise<proto.WebMessageInfo>}> => {

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
             const buttons = [
               { buttonId: `categories`, buttonText: { displayText: `categories` }, type: 1 },
               { buttonId: 'cart', buttonText: { displayText: `cart` }, type: 1 },
        
               { buttonId: 'menu', buttonText: { displayText: `menu` }, type: 1 }
             ]
    
      const buttonMessage = {
        text: '*Hi there* , ' + sender.pushName + emoji.greetings+` \nI am WhatsStore , ${emoji.explain_girl}\nA Revolutionary market place for smart people like you, \nRight from the comfort of your Whatsapp \n\n*For Manual Commands* \n\n */categories*: \n To see list of all categories of products \n */cart*: \n To look into your cart \n */search*: \n To search for products by their names \n */menu*: \n for this message`,
        buttons: buttons,
        headerType: 1
      }
      await socket.sendMessage(formatted_number , buttonMessage)
          }
      
      
      let user_state = await read_states(user.number);
      console.log(user_state)

    if(message.messages.length){

        if(Object.keys(sender!.message!).includes('extendedTextMessage')){
          if(Object.keys(sender!.message!.extendedTextMessage!).includes('contextInfo')){
            let content = sender!.message!.extendedTextMessage!;
            console.log(content)
            if(content!.contextInfo!.quotedMessage!.conversation === "=>reply for Address"){

              await set_address(socket , formatted_number , content.text , true)
            }
          }
        }
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
          if(content.toLowerCase().trim() === 'all'){
            await show_products(socket , formatted_number , 1 )
          }
        if(content.toLowerCase().trim() === 'products'){
                await show_products(socket , formatted_number , 1 );
        }
        if(content.toLowerCase().trim() === 'menu'){
            await show_menu(socket, formatted_number);
        }
        if(content.toLowerCase().trim() === 'categories'){
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
            case 'menu':
            await show_menu(socket, formatted_number);
            break;
            case 'categories':
            await show_category(socket , formatted_number)
            break;
            case 'All Products':
            await show_products(socket , formatted_number , 1 )
            break;
            case `Next${emoji.next_arrow}`:
            await next_page_products(socket , formatted_number , content.selectedButtonId);
            break;
            case `${emoji.prev_arrow}Prev`:
            await prev_page_products(socket , formatted_number , content.selectedButtonId);
            break;
            case 'Add to cart':
            await add_to_cart(socket , formatted_number , content.selectedButtonId!.replace('_addtocart',''))
            break;
            case 'Show cart':
            await show_cart(socket , formatted_number);
            break;
            case 'cart':
            await show_cart(socket , formatted_number);
            break;
            case 'Remove':
            await remove_from_cart(socket , formatted_number , content.selectedButtonId!)
            break;
            case 'Buy' :
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_)
            await purchase_options(socket , formatted_number , content!.selectedButtonId!.replace('_buy',''));
            break;
            case 'Buy This only':
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_)
            await purchase_options(socket , formatted_number , content.selectedButtonId!.replace('_buy',''));
            break;
            case 'Live Location':
              await prompt_for_location(socket , formatted_number)
            break;
            case 'Enter Address Manually':
              await get_address(socket , formatted_number , true)
            break;
            case 'Proceed' :
            states_ = await read_states(formatted_number.replace(Prefix,''));
            states_.order = {};
            states_.price = 0;
            write_states(formatted_number.replace(Prefix, ''), states_);
            await multi_purchase_options(socket , formatted_number);
            break;

            case 'Generate Invoice':
            await generate_receipts(socket , formatted_number )
            break;

            case 'Proceed to Pay':
            await generate_qrcode(socket , formatted_number);
            break;
          }


          for( let category of categories){
            if(content.selectedDisplayText === category.name){
              console.log(content.selectedDisplayText)
              await show_categorised_products(socket , formatted_number , category.name , 1)
            }
          }
          console.log(content.selectedDisplayText)
        }
        else if(Object.keys(sender!.message!).includes('listResponseMessage')){
          content = sender!.message!.listResponseMessage!;
          let details = content.singleSelectReply!.selectedRowId!.split('_');
          console.log(details);
          let product__ = await productSchema.findOne({product_id:details[0]});
          if(!product__){ await socket.sendMessage(formatted_number, {text:'Sorry for inconvenience ,Product doesn\'t seem to be in stock'})};

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
      await socket.sendMessage(formatted_number , {text:"Sorry , we could not understand what you meant by sending your location in here, And we would not be saving this with us."})
    }
  }
  redis.on('message',(channel:string , message:any)=>{
  	console.log('Coming from inside the sock',channel ,message);
  	socket.sendMessage('919654558103@s.whatsapp.net',{text:message})
  })
  	}
  }
}
    
})

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
        
          async sendSimpleMessage( number: string , content: string): Promise<proto.WebMessageInfo> {


            // console.log(await socket.sendMessage(`${number}${normalPrefix}`, { text: content }));

            const sendMessage = await socket.sendMessage(`${number}${normalPrefix}`, { text: content });
        
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
    console.log(channel , message)
    if(channel === 'payment_status_channel'){
      let parsed_message = JSON.parse(message);
      console.log(parsed_message);
      let {order_details , customer , number} = parsed_message;
      if(!parsed_message.success){
      	await client.sendSimpleMessage('919654558103',message);
      	return await client.sendSimpleMessage(number , `Something went wrong in processing your payment, We will update you about your order status after checking the issue properly`)
      }
      
       await client.sendSimpleMessage(number , `Order Placed for Dispatch\nInvoice ID:${order_details!._doc!.invoice_number!}\n\n${order_details!._doc.products.length > 1?'Items':'Item'}:\n${order_details!._doc!.products.map(i=>`*${i.product.title}*\n`)}\n\nWe will inform you as soon as Product is Dispatched By Merchant`)
      
    }

//    if ( channel === 'order_status_channel' ){
//    	 let parsed_message = JSON.parse(message);
//      console.log(parsed_message);
//      let { 
//      	invoice_number,
//        	delivery_status,
//        	payment
//      	} = parsed_message;
//      let order_details = await orderSchema.findOne({invoice_number});
//      if(order_details){
//      let products = `${order_details!.products.length > 1?'Items':'Item'}:\n${order_details!.products.map(i=>`*${i.product.title}*\n`)}`;
//      if(delivery_status === 'en-route'){
//      	client.sendSimpleMessage(order_details.ordered_by.number , `*Hey*\n${order_data.products[0].product.title} has been Dispatched from the Store \nIt probably should reach to you in ${order_data.delivery_duration? `approx. ${order_data.delivery_duration}`:'a few'} Days ${emoji.angel_face} )
//      }
//      if(delivery_status === 'delivered'){
//      
//      }
//      }
//    }
  })

//   const MessageSended = await client.sendSimpleMessage( 'Sent from Baileys' , '919654558103');
// console.log(JSON.stringify(MessageSended, undefined, 2));
 

})()


      //   const templateButtons = [
      //   {index: 1, quickReplyButton: {displayText: 'Buy'}},
      //   {index: 2, quickReplyButton: {displayText: 'Add to cart'}},
      //   {index: 3, quickReplyButton: {displayText: 'reviews', id: 'id-like-buttons-message'}},
      // ]
    
      // const templateMessage = {
      //   image: {url: product.image},
      //     caption: `*${product.title}* \n${product.description}`,
      //     footer: `Price: ${product.currency} ${product.price}`,
      //     templateButtons: templateButtons
          
      // }

      //List message -Sections
//       const sections = [
//     {
//   title: "Section 1",
//   rows: [
//       {title: "Option 1", rowId: "option1"},
//       {title: "Option 2", rowId: "option2", description: "This is a description"}
//   ]
//     },
//    {
//   title: "Section 2",
//   rows: [
//       {title: "Option 3", rowId: "option3"},
//       {title: "Option 4", rowId: "option4", description: "This is a description V2"}
//   ]
//     },
// ]


// const listMessage = {
//   text: "This is a list",
//   footer: "nice footer, link: https://google.com",
//   title: "Amazing boldfaced list title",
//   buttonText: "Required, text on the button to view the list",
//   sections
// }
//         const sections = [
//     {
//   title: "Section 1",
//   rows: [
//       {title: "Option 1", rowId: "option1"},
//       {title: "Option 2", rowId: "option2", description: "This is a description"},
//       {title: "Option 6", rowId: "option3", description: "This is also a  description"}
//   ]
//     },
//    {
//   title: "Section 2",
//   rows: [
//       {title: "Option 3", rowId: "option3"},
//       {title: "Option 4", rowId: "option4", description: "This is a description V2"}
//   ]
//     },
// ]


// const listMessage = {
//   text: "This is a list",
//   footer: "nice footer, link: https://google.com",
//   title: "Amazing boldfaced list title",
//   buttonText: "Required, text on the button to view the list",
//   sections
// }
//       // await socket.sendMessage(message.messages[0].key.remoteJid! , listMessage)
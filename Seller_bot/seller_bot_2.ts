import { Boom } from '@hapi/boom';
import { config } from 'dotenv';
import makeWASocket, { AnyMessageContent, delay, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, MessageRetryMap, useMultiFileAuthState , downloadMediaMessage , proto } from '../../src';
import MAIN_LOGGER from '../../src/Utils/logger';
import { show_menu } from './utils/menu';
import { signin , check_pass } from './utils/signin';
import { Prefix , wait , write_states , read_states , write_logs , possible_categories} from './utils/utility_methods';
import { all_orders , current_orders , update_order , set_update_order , delivery_duration , on_confirmation_of_order } from './utils/orders';
import mongoose from 'mongoose';

import fs from 'fs';
import path from 'path';

const os = require('os');
const shortid = require('shortid');
const redis = new (require('ioredis'))();
const productSchema = require('../models/product_model');
const sellerSchema = require('../models/seller_model');

const logger = MAIN_LOGGER.child({});
logger.level = 'silent';

config();

var session ='seller_'+module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length -3);

//================================================================
//================Pagination Components===========================
// let nextButton = {
//       text:`Go To Page: ${Number(states.pagination.page)+1}`,
//       buttons:[{
//         buttonId:category , buttonText:{displayText:'Next->'} , type:1
//       }],
//       headerType:1
//     }
//     let prevButton = {
//      text:`Go To Page: ${Number(states.pagination.page)-1}`,
//       buttons:[{
//         buttonId:category , buttonText:{displayText:'<-Prev'} , type:1
//       }],
//       headerType:1
//     }
//     let paginate_buttons = {
//       text:`Go To Page: ${Number(states.pagination.page)-1} or Go To Page: ${Number(states.pagination.page)+1}`,
//       buttons:[{
//         buttonId:category , buttonText:{displayText:'<-Prev'} , type:2
//       },{
//         buttonId:category , buttonText:{displayText:'Next->'} , type:1
//       }],
//       headerType:1
//     }
//     let {page , offset} = states.pagination;
//     console.log(products.length - ((page-1)*offset))


// const next_page_products = async (socket:any , sender:string)=>{
//   const states = await read_states(sender.replace(Prefix,''));
//   states.pagination.page+=1;
//   let {category} = states.pagination;
//   await write_states(sender.replace(Prefix,'') , states);
//   return await show_categorised_products(socket , sender , category)
                   // ---------------------------------------------------
// }
// const prev_page_products = async (socket:any , sender:string)=>{
//   const states = await read_states(sender.replace(Prefix,''));
//   states.pagination.page-=1;
//   let {category} = states.pagination;
//   await write_states(sender.replace(Prefix,'') , states);
//   return await show_categorised_products(socket , sender , category)
                     // ---------------------------------------------------
// };

//======Initiates Upload process ===========================================
const single_upload_product = async(socket:any,formatted_number:string , next:boolean=true)=>{
  let state = await read_states(formatted_number);
  let row_suffix = next?'category_single':'category_edit';
  let sections = [
      {
  title: "Category",
  rows: possible_categories.map(i=>{return {title:i,rowId:`${i}_${row_suffix}`}})
    },
  ];

  await socket.sendMessage(formatted_number , {
    text:"Please select the Category,\nYour product belongs to",
    title:"Select Category",
    buttonText:"Select Category",
    sections
  })
  if(!next){
      return
  }
      state.active_state = 'single_upload';
      state.states.single_upload.waiting_for = 'category'
      state.states.single_upload.data = {}
      write_states(formatted_number , state);
}

const single_upload_category = async(socket:any , formatted_number:string , message:string , next:boolean=true)=>{
  let state = await read_states(formatted_number);
  state.states['single_upload'].data = {category:message};
  if(next){
    state.states['single_upload'].waiting_for = 'data';
    await write_states(formatted_number , state);
  await socket.sendMessage(formatted_number , {text:`Please enter Product details line by line 
  Seperated by \'Enter\'

  *In this Format*:-
  *Title*
  *Stock*
  *Price*
  *Original Price* ( _optional_ , can Leave empty here)`,
  buttons:[
  {buttonId:"product_example" , buttonText:{displayText:"Need Example"} , type:1}
  ],
  headerType:4
  })
}else{
}
}

const single_upload_data = async(socket:any , formatted_number:string , message:string)=>{
    let data_ = message.split('\n');
    let error_field = '';
    if(data_.length < 3){
      return await socket.sendMessage(formatted_number , {text:"Missing data,\nTitle , Price and Stock are Required fields , originalPrice can be left blank"})
    }
    for(let i of data_.slice(1,5)){
      if(isNaN(Number(i)) || !i){
        switch(data_.indexOf(i)){
          case 0:
          error_field = 'price'
          break;
          case 1:
          error_field = 'originalPrice'
          break;
          case 2:
          error_field = 'stock'
          break;
          default:
          error_field = 'field';
          break;
        }
        return await socket.sendMessage(formatted_number , {text:`*Error*\nWe recieved\n${error_field} as _${i?i:'empty'}_ \nIt should only be a real number\n\n Please try again`})
      }
    }
  let state = await read_states(formatted_number);
  state.states['single_upload'].waiting_for = 'description';
  Object.assign(state.states['single_upload'].data , {title:data_[0],stock:data_[1],price:data_[2],originalPrice:data_.length>3?data_[3]:data_[2]});
  await write_states(formatted_number , state);
  await socket.sendMessage(formatted_number , {text:"Now Write up some description about the product"})
}

const single_upload_description = async(socket:any , formatted_number:string , message:string , next:boolean=true)=>{
  //Saves Description
  //Triggers for Properties
  let id_suffix = next ? 'property_single' : 'property_edit';
  
  let sections = [
      {
  title: "Properties",
  rows: [
  {title:"Colors",rowId:`colors_${id_suffix}`},
  {title:"Sizes",rowId:`sizes_${id_suffix}`},
  {title:"Variations",rowId:`variations_${id_suffix}`},
  {title:"Skip",rowId:`skip_${id_suffix}` , description:"Select this to skip and move onto next step"},
  ]
    },
  ];

  await socket.sendMessage(formatted_number , {
    text:"Please select Any Additional Options you would like to add for the Customers, regarding purchase of this product\n\nOr Choose Skip and proceed to Images",
    title:"Select Options",
    buttonText:"Select Options",
    sections
  });
  if(!next){return}
  let state = await read_states(formatted_number);
  state.states['single_upload'].waiting_for = 'properties';
  Object.assign(state.states['single_upload'].data ,{description:message});
  await write_states(formatted_number , state);
}

const single_upload_property = async (socket:any , formatted_number:string , message:string)=>{
      let state = await read_states(formatted_number);
      if(message !== 'skip'){
      state.states.single_upload.property = message;
       await write_states(formatted_number , state);
      await socket.sendMessage(formatted_number , {text:"Please Enter Options for the selected property\n( _These can multiple Type options, and should be seperated by \" # \"_ )\n*Example*:\n(if chosen \"color\" )\nType => Red # Blue # Green \n\n Or \n\n Type => Red (if only Red color is available) "})
    }
    else{
      await single_upload_image(socket , formatted_number , '' , 'skip');
    }    
    }

const single_upload_image = async(socket:any , formatted_number:string , message:string , key:string='')=>{
        let state = await read_states(formatted_number)
        if(key !== 'skip'){
          let data_ = message.split('#');
          state.states.single_upload.data[state.states.single_upload.property] = data_;
          write_states(formatted_number , state);
          return await socket.sendMessage(formatted_number , {
            text:"Option Added\nAdd more properties if you want\nOr Select \"Proceed\" to proceed to next step",
            buttons:[
            {buttonId:"single_upload_proceed_images" , buttonText:{displayText:"Proceed"} , type:1}],
            headerType:4
          })
        }
        state.states.single_upload.waiting_for = 'image';
        await write_states(formatted_number , state);
        await socket.sendMessage(formatted_number , {text:"Please Upload the image of the product"});
}

const single_upload_confirm = async (socket:any , formatted_number:string , messages:any)=>{
    let state = read_states(formatted_number);
    let message_ = messages.messages[0].message;
    let url = message_.imageMessage.url.split('/');
    let name = url[url.length-1];
    let src_name = `./static/images/${formatted_number.replace(Prefix , '')}/${name}.${message_.imageMessage.mimetype.split('/')[1]}`
    state.states.single_upload.data['image'] = src_name;
    state.states.single_upload.waiting_for = 'confirm';
    let file_ = await downloadMediaMessage( messages.messages[0] , 'buffer' , {} );
    fs.existsSync(`./static/images/${formatted_number.replace(Prefix , '')}`)?null:fs.mkdirSync(`./static/images/${formatted_number.replace(Prefix , '')}`);
            await fs.writeFile(src_name,file_ as Buffer, ()=>{});
     await console.log('Image '+src_name+' Saved');
     let public_id = shortid().replace(/_/g,'')
     state.states.single_upload.data['public_id'] = public_id;
     await write_states(formatted_number , state);
     let {category , title , price , originalPrice , stock , description , image , sizes , colors , features , variations} = state.states.single_upload.data;
     let {_id , currency } = await sellerSchema.findOne({formatted_number});
       let properties = '';
       let properties_ = {}
       if (sizes){
         properties+=`Sizes : ${sizes}\n`;
         properties_['sizes'] = sizes;
       }
       if (colors){
         properties+=`colors : ${colors}\n`;
         properties_['colors'] = colors;
       }
       
       if (variations){
         properties+=`Variations : ${variations}\n`;
         properties_['variations'] = variations;
       };

     let product = await new productSchema({
       public_id,
       category,
       title,
       price:Number(price),
       originalPrice:Number(originalPrice),
       currency:'hkd',
       stock:Number(stock),
       description,
       image,
       status:'private',
        properties:[{...properties_}],
        seller_details:_id,
        added_by:'seller'
     });

     let new_product = await product.save();
     let current_seller = await sellerSchema.findOne({formatted_number});
     current_seller.products_uploaded.push(new_product._id);
     await current_seller.save();


     let buttonMessage = [
     {buttonId:`edit_data_${public_id}` ,buttonText:{displayText:"Edit"} , type:1 },
     {buttonId:"confirm_data" ,buttonText:{displayText:"Confirm"} , type:1 }
     ]

     let finalMessage = {
       image:{url : image},
       caption:`*Product Details*:\n*Title* : ${title},\n*Price* : ${currency} ${price},\n${originalPrice !== price ? `*Original price* : ${originalPrice?'~'+currency+' '+String(originalPrice)+'~':'Unspecified'}`:'' },\n*Stock* : ${stock},\n*Description* : ${description},\n*Available Options*:\n${properties}`,
       buttons:buttonMessage,
       headerType:4
     }
await socket.sendMessage(formatted_number , finalMessage);
};

const save_single_product = async(socket:any , formatted_number:string)=>{
  let state = await read_states(formatted_number);
  let {public_id} = state.states[state.active_state].data;
  let product = await productSchema.findOne({public_id});
  product.status = 'public';
  await product.save();
  state.active_state = 'general';
  state.states.single_upload.waiting_for = state.states.single_upload.steps[0]
  
 await socket.sendMessage(formatted_number , {text:"Product Saved"});
 await wait(.5);
 await show_menu(socket , formatted_number);
}


//=============Initiates Edit of product ==========================
const edit_product_select_option = async (socket:any , formatted_number:string , product_id:string) =>{
    let state = read_states(formatted_number);
    let product_data = await productSchema.findOne({public_id:product_id});
    let rows:any = [];
    let privates = ['_id','__v','public_id','product_id' , 'rating' , 'reviews' , 'date' , 'status' ];
    let all_fields = await Object.keys(product_data._doc).filter(i=>!privates.includes(i))
    for(let i of all_fields){
      let data = {rowId: `edit_product_${i}_${product_data.public_id}` , title:i}
      rows.push(data);
    }
    let sections = [{title : "Select Field to edit",rows}];
    let message = {
      text:"Please Choose the Field you would like to edit",
      buttonText:"Choose",
      title:"Options",
      sections
    }

    await socket.sendMessage(formatted_number , message);
}

const edit_product_get_data = async(socket:any , formatted_number:string , message:string , listId:string)=>{
  let state = read_states(formatted_number);
  // let anchors = listId.split('_');
  let public_id:string = listId;
  let field:string = message;

  state.active_state = 'edit_product';
  state.states.edit_product.data = {public_id , field};

  await write_states(formatted_number , state);
if(field === 'category' || field === 'properties'){
  await socket.sendMessage(formatted_number , {text:"Please Select one of the Options"});
  if(field === 'category'){
    await single_upload_product(socket , formatted_number , false)
  }
  if(field === 'properties'){
    await single_upload_description(socket , formatted_number , '' , false);
  }
}
if(field === 'image'){
  await socket.sendMessage(formatted_number , {text:"Please Upload New Image"});
}
else{
  await socket.sendMessage(formatted_number , {text:`Please Write Updated ${field}`});
}
}

const edit_product_set_data = async(socket:any , formatted_number:string , messages:any='')=>{
    let state = read_states(formatted_number);
    let {public_id , field } = state.states.edit_product.data;
    if(public_id && field){
      if(field === 'properties' ){
        //Messages should be selected property name
        if(messages === 'skip'){
          await socket.sendMessage(formatted_number , {text:"Adding Property Skipped"})
        }else{
          state.states.edit_product.data.field = messages;
          await socket.sendMessage(formatted_number , {text:"Please Enter Options for "+messages+"\n( _These can multiple Type options, and should be seperated by \" # \"_ )\n*Example*:\n(if chosen \"color\" )\nType => Red # Blue # Green \n\n Or \n\n Type => Red (if only Red color is available) "})
        }
      }
      else{
        if(field === 'image'){
        //Messages Param should be WaIMessage object
         let message_ = messages.messages[0].message;
    let url = message_.imageMessage.url.split('/');
    let name = url[url.length-1];
    let src_name = `./static/images/${formatted_number.replace(Prefix , '')}/${name}.${message_.imageMessage.mimetype.split('/')[1]}`
 
    let file_ = await downloadMediaMessage( messages.messages[0] , 'buffer' , {} );
    fs.existsSync(`./static/images/${formatted_number.replace(Prefix , '')}`)?null:fs.mkdirSync(`./static/images/${formatted_number.replace(Prefix , '')}`);
            await fs.writeFile(src_name,file_ as Buffer, ()=>{});
     await console.log('Image '+src_name+' Saved'); 
     let product_data = await productSchema.findOne({public_id});
     product_data.image = src_name;
     await product_data.save();
      }
      
      else{
        let product_data = await productSchema.findOne({public_id});
        console.log(messages);
        if(field === 'price' || field === 'stock' || field === 'originalPrice'){
          if(isNaN(Number(messages))){
            return await socket.sendMessage(formatted_number , {text:`${field} should be in *Numerical* digits, without any other symbols`})
          }
        }
        if(field === 'categories'){
          if(!possible_categories.includes(messages.trim())){
            return await socket.sendMessage(formatted_number , {text:`No such category Found`})
          }
        }
        product_data[field] = messages;
        await product_data.save();
      }
      await socket.sendMessage(formatted_number , {text:`${field} Updated`});
      await wait(1);
      let product_data = await productSchema.findOne({public_id});
      let {category , title , price , originalPrice , stock , description , image , properties} = await product_data;
     let {_id , currency } = sellerSchema.findOne({formatted_number});
     let {sizes , colors , features , variations} = properties;
     let properties_ = ''

       if (sizes){
         properties_+=`Sizes : ${sizes}\n`;
      
       }
       if (colors){
         properties_+=`colors : ${colors}\n`;
      
       }
       if (features){
         properties_+=`Features : ${features}\n`;
      
       }
       if (variations){
         properties_+=`Variations : ${variations}\n`;
     
       };

     let buttonMessage = [
     {buttonId:`edit_data_${public_id}` ,buttonText:{displayText:"Edit"} , type:1 },
     {buttonId:"confirm_data" ,buttonText:{displayText:"Confirm"} , type:1 }
     ]

     let finalMessage = {
       image:{url : image},
       caption:`*Product Details*:\n*Title* : ${title},\n*Price* : ${originalPrice !== price ? `*Original price* : ${originalPrice?'~'+currency+' '+String(originalPrice)+'~':'Unspecified'}`:'' },\n*Stock* : ${stock},\n*Description* : ${description},\n*Available Options*:\n${properties_}`,
       buttons:buttonMessage,
       headerType:4
     }
await socket.sendMessage(formatted_number , finalMessage);
      // state.active_state = 'general';
      //   state.states.edit_product.data = {};
      //   await write_states(formatted_number , state);
      //   await show_menu(socket , formatted_number);
    }
  }
}


//=================Shows All Products====================
const all_products = async(socket:any , formatted_number:string)=>{
    let {_id , currency } = await sellerSchema.findOne({formatted_number});
    let seller_data = await sellerSchema.findOne({formatted_number}).populate('products_uploaded');
    let all_products = seller_data.products_uploaded;
    if(!all_products.length){
      return await socket.sendMessage(formatted_number , {text:`*Oops*\nSeems Like you haven't Uploaded any Products yet\nFound no products`})
    }
    let state = await read_states(formatted_number);
    let { page , offset } = state.pagination;
    for(let p of all_products.slice(page-1 , offset)){

     let {category , title , public_id , price , originalPrice , stock , description , image , properties , status} = await p;

     let {sizes , colors , variations} = properties;
     let properties_ = ''

       if (sizes){
         properties_+=`Sizes : ${sizes}\n`;
       }
       if (colors){
         properties_+=`colors : ${colors}\n`;
       }
       if (variations){
         properties_+=`Variations : ${variations}\n`;
       };

     let buttonMessage = [
     {buttonId:`edit_data_${public_id}` ,buttonText:{displayText:"Edit"} , type:1 },
     {buttonId:`delete_init_${public_id}` ,buttonText:{displayText:"Delete"} , type:1 }
     ]

     let finalMessage = {
       image:{url : image},
       caption:`*Product Details*:\n*Title* : ${title},\n*Price* : ${currency} ${price},\n${originalPrice !== price ? `*Original price* : ${originalPrice?'~'+currency+' '+String(originalPrice)+'~':'Unspecified'}`:'' },\n*Status* : ${status}\n*Stock* : ${stock},\n*Description* : ${description},\n*Available Options*:\n${properties_}`,
       buttons:buttonMessage,
       headerType:4
     }
await socket.sendMessage(formatted_number , finalMessage);
    }
        
       let nextButton = {
      text:`Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:'products' , buttonText:{displayText:'Next->'} , type:1
      }],
      headerType:1
    }
    let prevButton = {
     text:`Go To Page: ${Number(page)-1}`,
      buttons:[{
        buttonId:'products' , buttonText:{displayText:'<-Prev'} , type:1
      }],
      headerType:1
    }
    let paginate_buttons = {
      text:`Go To Page: ${Number(page)-1} or Go To Page: ${Number(page)+1}`,
      buttons:[{
        buttonId:'products' , buttonText:{displayText:'<-Prev'} , type:2
      },{
        buttonId:'products' , buttonText:{displayText:'Next->'} , type:1
      }],
      headerType:1
    }

    console.log(all_products.length - ((page-1)*offset))
    if(page === 1 && all_products.length - ((page-1)*offset) >= offset){
      await socket.sendMessage(formatted_number , nextButton)
    }
    else if(page > 1 && all_products.length - ((page-1)*offset) < offset){
        await socket.sendMessage(formatted_number , prevButton);
    }
    else if(page === 1 && all_products.length - ((page-1)*offset) < offset ){

    }
    else{
     await socket.sendMessage(formatted_number , paginate_buttons) 
    }
}

const delete_product_initiate = async(socket:any , formatted_number:string , public_id:string)=>{
  
  let {title} = await productSchema.findOne({public_id});
  await socket.sendMessage(formatted_number , {
    text:`Are you Sure you want to delete Product named:\n *${title}*`,
    buttons:[
    {buttonId:`delete_yes_${public_id}` , buttonText:{displayText:"Yes"},type:1},
    {buttonId:`delete_no_${public_id}` , buttonText:{displayText:"No"},type:1},
    ],
    headerType:4
  })
};

const delete_product_confirmation = async(socket:any , formatted_number:string , public_id:string , confirmation:string)=>{
  if(confirmation === 'yes'){
    let seller_data = await sellerSchema.findOne({formatted_number}).populate('products_uploaded');
    let selected_product = seller_data.products_uploaded.filter(i=>i.public_id === public_id);
    if(selected_product.length){
    let product_data = await productSchema.findOne({product_id:selected_product[0].product_id});
    let product = await productSchema.deleteOne({product_id:selected_product[0].product_id});
    console.log(product);
    await socket.sendMessage(formatted_number , {text:`Product : ${product_data.title} Deleted`});
    await wait(1);
    await all_products(socket , formatted_number);
  }else{
    await socket.sendMessage(formatted_number , {text:"Error occured in Deleting product\nWe were unable to process your request"})
  }
  }else{
    await socket.sendMessage(formatted_number , {text:"Delete Cancelled\nShowing all products now"});
    await wait(.2)
    await all_products(socket , formatted_number);
  }

}

const how_this_works = async(socket:any , formatted_number:string)=>{
  let message = `Welcome to *WhatStores Merchant Panel*
Using this tool You can Manage Your *Products Inventory*
and Handle *Incoming order's*
Right from the Comfort of Whatsapp. 

1. *How to Upload Products*:
*>* First You would need to Select 
Category Of your product 
*>* Then You'll be Prompted to Send us 
    Products name , it's Sale Price
    The original Market price 
    And Current Stock availability
*>* Afterwards You can Send us Description of that Product
*>* Then , You'll have the ability to Enter 
All Available Options 
of the Product Colors / Sizes
As well as its Features
*>* Finally you would have to Upload Product's Image
(One Only)
And its Done. 

2.*Order/Delivery process*:
*>* Customer Initiates an order,
*>* We notify you of the same,
*>* You Must thoroughly pack the product
    And Send it to Customer's Address
    either by Courrier or Personal Means
    *Then* 
    Update Order's status to:
    "En-route"
*>* Select Approx days it would take to deliver
*>* When Customer Confirm's
    Receiving of Delivery
    We Will Instantly 
    Send out the payment to your Bank Account `;
    await socket.sendMessage(formatted_number , {text:message}) 
}

const logout = async(socket:any , formatted_number:string)=>{
  let state = read_states(formatted_number);
  state.authorized = false;
  await write_states(formatted_number , state);
  await socket.sendMessage(formatted_number , {text:"You have been logged out.\nThank you for using our platform"});
  await show_menu(socket , formatted_number);
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
    auth: state,
    defaultQueryTimeoutMs:10000000,
    syncFullHistory:false,
    
  });
  store?.bind(socket.ev);

  socket.ev.on('connection.update', async (e) => {
    console.log(e)
    await saveCreds();

  });

  socket.ev.on('messages.upsert', async (message) => {
      await write_logs(JSON.stringify(message))
    if(message.type === 'notify'){

      if(message.messages[0].status === 2) return;

      if(message.messages[0].key.remoteJid?.match(/@broadcast/gi)?.length) return;

      if(message.messages[0].key.remoteJid?.match(/@g.us/gi)?.length) return;

      if(message.messages[0].key.fromMe){return }

      let sender = message.messages[0];

      let formatted_number = sender.key!.remoteJid!;
   
    
      let user = await sellerSchema.findOne({formatted_number});

      if(!fs.existsSync(`./seller/${formatted_number.replace(Prefix,'')}_states.json`)){
        let template = fs.readFileSync('./seller/template_states.json','utf8')
        fs.writeFileSync(`./seller/${formatted_number.replace(Prefix,'')}_states.json` , template);
      }

      if(!user){
            user  = await new sellerSchema({
              pushname:sender.pushName,
              seller_id:shortid.generate(),
              number:formatted_number.replace(Prefix,''),
              formatted_number:formatted_number,
              products_uploaded:[]
            });
            user = await user.save();
            await console.log(user);
            let message = await {
              text:'Greetings!! Ã°Å¸ËœÅ \nWelcome to WhatStores Merchant Panel\nA Plethora of Opportunities and Sales Revenue Awaits you.\n If You\'re a Merchant Looking for Treading new Waters to Trade.\nHurry Up and Join Our Stores Ã°Å¸Ëœâ€°',
              buttons:[
              {buttonId:`signup`, buttonText: {displayText: `Sign Up`}, type: 1 },
              {buttonId:`aboutus`, buttonText: {displayText: `About Us`}, type: 1 },
              // {buttonId:`benefits`, buttonText: {displayText: `Benefits`}, type: 1 },
              ],
              headerType:4
            }
            let signin_message = await {
              text:'Already a User?',
              buttons:[
              {buttonId:`signin`, buttonText: {displayText: `Sign In`}, type: 1 }
              ],
              headerType:4
            }
            await socket.sendMessage(formatted_number  , message)
            await socket.sendMessage(formatted_number  , signin_message)
          }



    if(message.messages.length){

        // if(Object.keys(sender!.message!).includes('extendedTextMessage')){
        //   if(Object.keys(sender!.message!.extendedTextMessage!).includes('contextInfo')){
        //     let content = sender!.message!.extendedTextMessage!;
        //     console.log(content)
        //     // if(content!.contextInfo!.quotedMessage!.conversation === "=>reply for Address"){

         //       // await set_address(socket , formatted_number , content.text)
        //     // }
        //   }
        // }
      if(message.messages[0].message){
          let content , buttonResponse;
          let states = await read_states(formatted_number);
          if(Object.keys(sender!.message!).includes('conversation')){
          content = await String(sender!.message!.conversation!);
          console.log(content.toLowerCase().trim())
          if(content.toLowerCase().trim() === 'menu'){
            if(!states.authorized){
              let signin_message = await {
                text:'Already a User?',
                buttons:[
                {buttonId:`signin`, buttonText: {displayText: `Sign In`}, type: 1 }
                ],
                headerType:4
              }
              return await socket.sendMessage(formatted_number  , signin_message)
            }
            await console.log(formatted_number)
            if(states.active_state !== 'general'){
              await socket.sendMessage(formatted_number , {text:"Current process Exited, Coming Back to Main menu"})
            }
            await show_menu(socket, formatted_number);
        }
        
        if(content.toLowerCase().trim() === 'logout'){
          return logout(socket , formatted_number);
         }

         if(states.active_state === 'signin'){
           return check_pass(socket , formatted_number , content)
         }
         
         if(states.active_state === 'single_upload'){
           switch(states.states.single_upload.waiting_for){
               case 'data':
               await single_upload_data(socket , formatted_number , content);
               break;
               case 'description':
               await single_upload_description(socket , formatted_number , content);
               break;
               case 'properties':
               if(content.toLowerCase().trim() === 'proceed'){
                 await single_upload_image(socket , formatted_number , '', 'skip');
               }
               else{
                 await single_upload_image(socket , formatted_number , content)
              }
            }
          }

          if(states.active_state === 'edit_product'){
            await edit_product_set_data(socket , formatted_number , content);
          }
}
        if(Object.keys(sender!.message!).includes('imageMessage')){
        if(states.active_state === 'single_upload'){
//           if(Object.keys(sender!.message!).includes('documentMessage')){
//           if(states.states.multi_upload.waiting_for === 'csv'){
//                await download_csv(socket , formatted_number , message)
//             }
//           }
          
          if(states.states.single_upload.waiting_for === 'image'){
               await single_upload_confirm(socket , formatted_number , message);
          }
        }
          if(states.active_state === 'edit_product'){
            if(Object.keys(states.states.edit_product.data).includes('field')){
                    if(states.states.edit_product.data.field === 'image'){
                      await edit_product_set_data(socket , formatted_number , message);
                    }
                  }
            }
         
         }

        
      
        else if(Object.keys(sender!.message!).includes('buttonsResponseMessage')){
            let states_;
          content = await sender!.message!.buttonsResponseMessage!;


          if(content!.selectedButtonId.includes('edit_data')){
            let product_id = content!.selectedButtonId!.split('_');
            await edit_product_select_option(socket , formatted_number , product_id[2]);
          }

          if(content!.selectedButtonId!.includes('order_update')){
            await update_order(socket , formatted_number , content!.selectedButtonId);
          }
          if(content!.selectedButtonId!.includes('order_cancel')){
            await socket.sendMessage(formatted_number , {text:"progress Under develpoment"})
          }

          if(content!.selectedButtonId!.includes('delete')){
            let action = content!.selectedButtonId.split('_')[1];
            let public_id = content!.selectedButtonId.split('_')[2];
            if(action === 'init'){
              await delete_product_initiate(socket , formatted_number , public_id);
            }else{
              await delete_product_confirmation(socket , formatted_number , public_id , action);
            }
          }

          if( content!.selectedButtonId!.includes('delivered_confirmation')){
            await on_confirmation_of_order(socket , formatted_number , content!.selectedButtonId!);
          }

          console.log(content.selectedButtonId)
          switch(content.selectedButtonId!){
            case 'menu':
            if(states.active_state !== 'general'){
              await socket.sendMessage(formatted_number , {text:"Current process Exited, Coming back to Main menu"})
            }
            await show_menu(socket, formatted_number);
            break;

            // case 'signup':
            // if(states.active_state !== 'general'){
            //   await socket.sendMessage(formatted_number , {text:"Current process Exited, Continuing it with Sign Up"})
            // }
            // await signup(socket , formatted_number);
            // break;
            case 'how':
            await how_this_works(socket, formatted_number)
            break;
            case 'signin':
            if(states.active_state !== 'general'){
              await socket.sendMessage(formatted_number , {text:"Current process Exited, Continuing it with Sign In"});
            }
            await signin(socket , formatted_number);
            break;

            case 'aboutus':
            break;

            case 'view_products':
              await all_products(socket , formatted_number);
            break;
            // case 'upload_products':
            // await upload_products(socket , formatted_number)
            // break;

            // case 'multi_upload':
            // await multi_upload_products(socket , formatted_number , content , 'csv')
            // break;

            // case 'proceed_upload_images':
            //   await proceed_upload_images(socket , formatted_number);
            // break;

            // case 'confirm_proceed_upload_images':
            // await confirm_proceed_upload_images(socket,formatted_number);
            // break;

            case 'upload_product':
            await single_upload_product(socket , formatted_number);
            break;

            case 'single_upload_proceed_images':
            await single_upload_image(socket , formatted_number , '' , 'skip');
            break;

            case 'confirm_data':
            await save_single_product(socket , formatted_number)
            break;

            case "product_example":
            await console.log('example')
            await socket.sendMessage( formatted_number , {
              text:`Mens Casual Premium Slim Fit T-Shirts\n35.50\n50\nusd\n7`})
            break;

            case 'all_orders':
            await all_orders(socket , formatted_number);
            break;

            case 'current_orders':
            await current_orders(socket , formatted_number);
            break;



}
}
        
        if(Object.keys(sender!.message!).includes('listResponseMessage')){
          content = sender!.message!.listResponseMessage!;
          let details = content.singleSelectReply!.selectedRowId!.split('_');
          console.log(details);
          let rowId = content!.singleSelectReply!.selectedRowId!;
          if(rowId){
            if(details.includes('category') && details.includes('single')){
              await single_upload_category(socket , formatted_number , content.title.toLowerCase());
            }
            if(details.includes('category') && details.includes('edit')){
              await edit_product_set_data(socket , formatted_number , content.title.toLowerCase());
            };
            if(details.includes('property') && details.includes('single')){
              if(details[0] === 'skip'){
                await single_upload_property(socket , formatted_number , details[0]);
              }else{
                await single_upload_property(socket , formatted_number , content!.title!.toLowerCase());
              }
            }
            if(details.includes('property') && details.includes('edit')){
              if(details[0] === 'skip'){
                await edit_product_set_data(socket , formatted_number , details[0]);
              }else{
                await edit_product_set_data(socket , formatted_number , content!.title!.toLowerCase());
              }
            }
            if(details[0].toLowerCase() === 'edit' && details[1].toLowerCase() === 'product'){
              await edit_product_get_data(socket , formatted_number , details[2] , details[3])
            }
            if(details.includes('order')){
              await set_update_order(socket , formatted_number , rowId , content!.title);
            }
            if(rowId.toLowerCase().includes('delivery_duration')){
              await delivery_duration(socket , formatted_number , rowId , content!.title);
            }

          }
          
  }
  
}
    
}
  }
  });

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
        
          async sendSimpleMessage( number: string,content: string): Promise<proto.WebMessageInfo> {


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
  redis.subscribe('payment_status_channel');
  redis.on('message',async (channel:string , message:any)=>{
    if(channel === 'payment_status_channel'){
      console.log(message)
      let {info , _id , address , order_details , number} = JSON.parse(message);
      
      let {invoice_number , products , seller ,gross_price , net_price , vat , extra_charge , discount } = order_details._doc;
      let seller_number = seller.number;
      let product_message = '';
      let properties='';
      for(let i of products){
          let {title} = await productSchema.findOne({_id:i.product});
          
          for(let p of Object.entries(i.properties[0])){
            console.log(p)
            properties+=`*${p[0]}* : ${p[1]}\n`
          }
          product_message+=`\n=>*${title}*\n\n${properties}\n*Quantity*:${i.quantity}\n`
      }
      
      
      let { text} = JSON.parse(address);
      // let product_message = `${product_details.map(i=>[`*${i.product}*`,`*Quantity: ${i.quantity}*`].join('\n')).join('\n\n')}`;
      console.log('product message ',product_message);
      await client.sendSimpleMessage(seller_number , `*Received Order*:\n*Invoice No.*: ${invoice_number}\n${product_message}\n*Gross Price:*${gross_price}\n*VAT:* ${vat}%\n*Extra Charges* ${extra_charge||0}\n*Discount:* ${discount}%\n\n*Net Price* ${net_price || gross_price}\n`);
      await client.sendSimpleMessage(seller_number , `Address TO be Delivered at:${text} \n\nIF there is any discrepancy found in Address, Please contact customer @: https://wa.me/${number}`);
      await client.sendSimpleMessage(seller_number , `Go to "Active Orders" As soon as Products are dispatched to be Shipped.\nNet Price of product will be transferred to your A/c\nOn Getting Confirmation of delivery\nOR\n7 Days from Delivery status Getting Updated to "En-Route"`);
    }
  })

//   const MessageSended = await client.sendSimpleMessage( 'Sent from Baileys' , '919654558103');
// console.log(JSON.stringify(MessageSended, undefined, 2));
 

})()


//       const templateButtons = [
//     {index: 1, urlButton: {displayText: 'Ã¢Â­ï¿½ Star Baileys on GitHub!', url: 'https://github.com/adiwajshing/Baileys'}},
//     {index: 2, callButton: {displayText: 'Call me!', phoneNumber: '+1 (234) 5678-901'}},
//     {index: 3, quickReplyButton: {displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message'}},
// ]
    
//       const templateMessage = {
//         text:'Hello',
//           footer: 'This is Footer',
//           templateButtons: templateButtons
//       }

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
  // text: "This is a list",
  // footer: "nice footer, link: https://google.com",
  // title: "Amazing boldfaced list title",
  // buttonText: "Required, text on the button to view the list",
  // sections
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
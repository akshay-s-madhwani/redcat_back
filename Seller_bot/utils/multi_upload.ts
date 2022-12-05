import {downloadMediaMessage} from '../../../src';
const { Prefix , possible_categories , read_states , write_states } = require('./utility_methods')
const {show_menu} = require('./menu');
const productSchema = require('../models/product_model');
const fs = require('fs');

export const save_multi_products = async (formatted_number:string)=>{
  let data = await fs.readFileSync(`./csv_sheets/${formatted_number.replace(Prefix , '')}.csv`,'utf8');
      if(data){
          let data_ = data.split('\n');
          let headers = data_[0].split(',');
          headers = headers.map((h:string)=>h=h.toLowerCase());
          let pos = {category:headers.indexOf('category'),title:headers.indexOf('title'),price:headers.indexOf('price'),original_price:headers.indexOf('original_price'),image:headers.indexOf('image'),description:headers.indexOf('description'),color:headers.indexOf('color'),sizes:headers.indexOf('sizes'),features:headers.indexOf('features'),variations:headers.indexOf('variations')};
          let {category , title , price , image , description} = pos;
          
          data_ = data_.slice(1,);
          for(let d of data_){
            let chunk = d.split(',');
            let product_data = {
              category:chunk[category],
              title:chunk[title],
              price:Number(chunk[price]),
              image:chunk[image],
              description:chunk[description]
            };
            if(pos.color !== -1){
                Object.assign(product_data , {color:chunk[pos.color]})
            }
            if(pos.variations !== -1){
             Object.assign(product_data , {variations:chunk[pos.variations]})
            }
            if(pos.features !== -1){
              Object.assign(product_data , {features:chunk[pos.features]})
            }
            if(pos.sizes !== -1){
              Object.assign(product_data , {sizes:chunk[pos.sizes]})
            }
            if(pos.original_price !== -1){
              Object.assign(product_data , {original_price:chunk[pos.original_price]})
            }
            try{
            let product = await new productSchema(product_data);
             
            await product.save()
          }catch(e){
            await console.log('Error found in Saving Product data of '+formatted_number.replace(Prefix,''))
            await console.log(e)
          }

          }
      }
      
}

export const proceed_upload_images = async(socket:any , formatted_number:string)=>{
    let state = await read_states(formatted_number);
    let {data} = state.states.multi_upload;
    if(data.images >= data.uploaded){
      await save_multi_products(formatted_number);
      await socket.sendMessage(formatted_number , {
        text:"Data Uploaded !!"
      });
      state.active_state = 'general';
      state.states.multi_upload.waiting_for = 'csv';
      await show_menu(socket , formatted_number);
    }
    else{
        await socket.sendMessage(formatted_number , {
          text:`*Images required*: ${data.images}
*Images Uploaded: ${data.uploaded}*
are you sure you want to proceed without saving all images?`,
buttons:[
    {buttonId:"confirm_proceed_upload_images" , buttonText:{displayText:"Confirm"},type:1}
],
headerType:4
        })
    }
}

export const confirm_proceed_upload_images = async(socket:any , formatted_number:string)=>{
  let state = await read_states(formatted_number);
      await save_multi_products(formatted_number);
      state.active_state = 'general';
      state.states.multi_upload.waiting_for = 'csv';
  await socket.sendMessage(formatted_number,{text:"Data Uploading Finished"})
  await show_menu(socket , formatted_number);
}

export const multi_upload_products = async (socket:any , formatted_number:string , message:any, data_key:string)=>{
      let state = await read_states(formatted_number);
      state.active_state = 'multi_upload';
      state.states.multi_upload.waiting_for = 'csv'
      state.states.multi_upload.data = {}
      await write_states(formatted_number , state);
      let categories = '';
      for(let i of possible_categories){
        categories+=`${i}\n`;
      }
      
      await socket.sendMessage(formatted_number , {text:"Upload a CSV file with\nDetails of your Products\nIn the format provided below" , footer:"Note1:Images will be uploaded Afterwards\n\nNote2:Names of Images should be Written in Images column\nIf Image is hosted online ,Just Input the URL of it",headerType:1})
      await wait(1)
      await socket.sendMessage(formatted_number , {
        document:fs.readFileSync("./demo_upload_product_csv.csv"),mimetype:"text/csv",fileName:"products_demo_csv.csv"
      });
      // await socket.sendMessage(formatted_number , {Text:`*Acceptable Categories are*:-\n${categories}`});
}


const download_csv = async(socket:any , formatted_number:string , messages:any)=>{
  console.log(messages.messages);
    let message_ = await messages.messages[0].message;
    await console.log(Object.keys(message_)[0]);
    if(Object.keys(message_)[0] === 'documentMessage'){
      if(message_["documentMessage"].mimetype === "text/csv" || message_["documentMessage"].mimetype === "text/comma-separated-values"){
            let file_csv = await downloadMediaMessage( messages.messages[0] , 'buffer' , {} );
            
            await fs.writeFile(`records/${formatted_number.replace(Prefix , '')}_${shortid()}.csv`,(file_csv as Buffer).toString(),'utf8', ()=>{})
            let data = await check_csv(socket , formatted_number , file_csv);
            await fs.writeFile(`csv_sheets/${formatted_number.replace(Prefix , '')}.csv`,data,'utf8', ()=>{})
          }
          else{
            await socket.sendMessage(formatted_number , {text:"File Doesn't seem to be in a CSV format,\n Please try again with a csv file"});
          }
    }
}

export const check_csv = async(socket:any , formatted_number:string , file:any)=>{
  let extracted_data:any = [];
  let correct_data:any = [];
  let incorrect_data:any = [];
  let data = file.toString();
  let state = await read_states(formatted_number);

  let parsed_data = data.replace(/\r/g,'').split('\n');
  let headers = parsed_data[0].split(',');
  if(!String(headers).toLowerCase().includes('category') &&!String(headers).toLowerCase().includes('title') && !String(headers).toLowerCase().includes('price') && !String(headers).toLowerCase().includes('image') && !String(headers).toLowerCase().includes('description') && !String(headers).toLowerCase().includes('categories') ){
    return await socket.sendMesage(formatted_number , {text:"Required Headers are missing, Please Try again with the provided format"})
  }
  headers = headers.map((h:string)=>h=h.toLowerCase());
  let pos = {category:headers.indexOf('category'),title:headers.indexOf('title'),price:headers.indexOf('price'),image:headers.indexOf('image'),description:headers.indexOf('description'),color:headers.indexOf('color'),size:headers.indexOf('sizes'),features:headers.indexOf('features'),variations:headers.indexOf('variations')};
  parsed_data = parsed_data.slice(1,);
  for(let i of parsed_data){
    extracted_data.push(i.split(','));
  }
  for(let i of extracted_data){
    if(!i[pos['title']]){
      incorrect_data.push(`No Title found at Index ${extracted_data.indexOf(i)}`);
      continue;
    }
    console.log(i[pos['price']]);
    if(isNaN(Number(i[pos['price']]))){
      console.log(typeof Number(i[pos['price']]));
      incorrect_data.push(`Price should be a number found at Index ${extracted_data.indexOf(i)}`);
      continue;
    }
    let category = await possible_categories.filter(j=>i[pos['category']]);
    if(!category.length){
      incorrect_data.push(`Incorrect Category , Could not match with any present choices at Index ${i} , Possible categories are ${possible_categories.join(' , ')}`)
      continue;
    }
    if(!i[pos['image']].toLowerCase().startsWith('http') && !i[pos['image']].toLowerCase().includes('://')){
      if(i[pos['image']]){
          i[pos['image']] = `./csv_sheet/images/${i[pos['image']]}`;
          let m_state = state.states.multi_upload
          m_state.data.images?m_state.data.images = m_state.data.images+1:m_state.data.images = 1;}
}
    correct_data.push(i);

  }
  await socket.sendMessage(formatted_number , {text:`${correct_data.length} Products uploaded`});

  
  state.states['multi_upload'].waiting_for = state.states['multi_upload'].steps[1];
  await write_states(formatted_number , state);

  await socket.sendMessage(formatted_number,{text:"*Now Upload All images*,\nwhose names were mentioned in the csv,\n\They will be attached to the product accordingly\n\n Type \"*proceed*\" or\nclick on this button after they\'re uploaded",
      buttons:[
      {buttonId:"proceed_upload_images",buttonText:{displayText:"Proceed"},type:1}
      ],
      headerType:4
})
  if(incorrect_data.length){
    let sendable_data = incorrect_data.join('\n');
    if(incorrect_data.length<=5){
      await socket.sendMessage(formatted_number , {text:`Errors found in Provided CSV file\n\n${sendable_data}`});
    }
    else{
      await socket.sendMessage(formatted_number , {
        document:Buffer.from(sendable_data) ,mimetype:'text/csv' , fileName:"Errors_in_csv.csv" 
              })
    }
  }
  return [headers , ...correct_data].join('\n');
}

export const download_images = async(socket:any , formatted_number:string , messages:any)=>{
  let message_ = await messages.messages[0].message;
   if(Object.keys(message_)[0] === 'imageMessage'){
     let state = await read_states(formatted_number);
     let file_ = await downloadMediaMessage( messages.messages[0] , 'buffer' , {} );
            await fs.writeFile(`csv_sheets/images/${message_.imageMessage.fileName}`,file_ as Buffer, ()=>{});
            await fs.writeFile(`records/images/${formatted_number}_${message_.imageMessage.fileName}`,file_ as Buffer, ()=>{})
     await console.log('Image '+message_.imageMessage.fileName+' Saved');
     state.states.multi_upload.data.uploaded?state.states.multi_upload.data.uploaded = state.states.multi_upload.data.uploaded+1 : state.states.multi_upload.data.uploaded=1;
     await write_states(formatted_number , state);
   } 
}

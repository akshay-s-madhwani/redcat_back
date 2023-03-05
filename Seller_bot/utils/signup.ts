const { read_states , write_states , Prefix } = require('./utility_methods');
const sellerSchema = require('../../models/seller_model');

export const signup = async (socket:any , sender:string)=>{
    const states = await read_states(sender);
    if(states.authorized){return await socket.sendMessage(sender , {text:'Already logged In'})}
    //states.active_state = "signup";
    //await write_states(sender , states);
    //await socket.sendMessage(sender , {text:'Registering Process started\nPlease Enter your Shop Name' , footer:'to Close the process , Send 1'})
    await socket.sendMessage(sender , {text:"Please visit http://159.65.248.141:90/signup"})
}

export const save_details = async (socket:any , formatted_number:string , message:string)=>{
  const change_state = async(socket:any , formatted_number:string , message:string , data_key:string , next_message:object)=>{
  let state = await read_states(formatted_number);
  let {active_state , states} = state;
  if(active_state === 'signup'){
    let sub_state = await states[active_state];
    sub_state.data[data_key] = message;
    sub_state.step = await sub_state.step+1;
    if(sub_state.step >= sub_state.steps.length-1){
      sub_state.step = 0;
      active_state = 'general';
    }
    else{
        sub_state.waiting_for = sub_state.steps[sub_state.step];
      }
      state.states[active_state] = sub_state
        await write_states(formatted_number , state)
        await socket.sendMessage(formatted_number , next_message)     
      }
}
  let sender = formatted_number.replace(Prefix,'')
  let state = await read_states(sender);
  let {active_state , states} = state
    switch(states[active_state].waiting_for){
      case 'shopname':

      await change_state(socket , formatted_number , message , states[active_state].waiting_for , {text:'Please Enter your Email:'});
      break;

      case 'email':
      await change_state(socket , formatted_number , message , states[active_state].waiting_for , {text:'Please Enter a password' , footer:'Password should be atleast 6 digits long'})
      break;

      case 'password':
      if (message.length < 6){return await socket.sendMessage(formatted_number , {text:'Password too short.\nTry Again'})}
     await change_state(socket , formatted_number , message , states[active_state].waiting_for ,{text:'Finally\nPlease Enter your Registered *Shop\'s Address*\nEach line in Address should be seperated by Enter\n*Format*:\nShop Number\nBuilding Name\nStreet Name\nCity\n\n*e.g.*:\nH/32,2nd floor\nTokyo Complex\nHung Hom\nHongkong Island'})     
      break;

      case 'address':
      let sub_state = states['signup'];
      let address = message.split('\n');
      let formatted_address = {
        text:message,
        house:address[0],
        building:address[1],
        street:address[2],
        city:address[3]
      };

     await change_state(socket , formatted_number , message , states[active_state].waiting_for ,
       {
       text:`Please Confirm this Data to be correct , So it can be sent for Verification
*Email*:${sub_state.email}
*Shop name*:${sub_state.shopname}
*Shop Address*:
      Shop number: ${address[0]}
      Building Name: ${address[1]}
      Street Name: ${address[2]}
      City: ${address[3]}
`,
       buttons:[
         {buttonId:"confirm_signup" , buttonText:{displayText:"Confirm"} , type:1},
         {buttonId:"edit_signup" , buttonText:{displayText:"Edit"} , type:1}
       ],
       headerType:4
     })     
      break;

case "confirm":      
      state.authorized = true;
      let {data} = state.states['signup'];
      await write_states(sender , state);
      try{
      let seller = await sellerSchema.find({formatted_number});
      seller.shop_name = await data.shopname;
      seller.email = await data.email;
      seller.password = await  data.password;
      seller.address = await data.address;
      await seller.save();
}catch(e){
  console.log(e);
}
const buttonMessage = await {
              text:'*Congratulations On Becoming a Part of Asia\'s Biggest Growing Ecommerce Chains*\n*Main Menu*',
              buttons:[
                  {buttonId:`upload_products`, buttonText: {displayText: `Upload products`}, type: 1 },
                  {buttonId:`view_products`, buttonText: {displayText: `View your Products`}, type: 1 },
                  {buttonId:`current_orders`, buttonText: {displayText: `Current Orders`}, type: 1 },
                  {buttonId:`all_orders`, buttonText: {displayText: `All Orders`}, type: 1 },
                  {buttonId:`how`, buttonText: {displayText: `How does this work?`}, type: 1 },
                  {buttonId:`logout`, buttonText: {displayText: `Logout`}, type: 1 },
                  ],
                  headerType:4
          }
          await socket.sendMessage(formatted_number , buttonMessage);
     break;
    }
  
}

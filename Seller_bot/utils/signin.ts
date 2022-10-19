const { read_states , write_states , wait } = require('./utility_methods');
const { show_menu } = require('./menu');
const sellerSchema = require('../../models/seller_model');


export const signin = async (socket:any , sender:string)=>{
  const states = await read_states(sender);
  if(states.authorized){return await socket.sendMessage(sender , {text:'Already logged In'})}
    states.active_state = "signin";
    await write_states(sender , states);
    await socket.sendMessage(sender , {text:'Please Enter Credentials as email:password *e.g.* whatstore@store.com:111111'})
}

export const check_pass = async (socket:any , formatted_number:string , message:string)=>{
 let state = await read_states(formatted_number);
  let {active_state , states} = state;
  if(active_state === 'signin'){
    if(!message.includes(':')){return await socket.sendMessage(formatted_number , {text:'Wrong Format , Please be sure to include \":\" in between email and password'})}
      let creds = message.replace(/ /g , '').split(':');
    if(creds.length > 2){return await socket.sendMessage(formatted_number , {text:'Wrong Format , No need for more than one \":\"'})}

    let checker = await sellerSchema.findOne({email:creds[0]});

    if(!checker){
      return await socket.sendMessage(formatted_number , {text:`No Account found with email ${creds[0]}`})
    }

    if(checker.password !== creds[1]){
      return await socket.sendMessage(formatted_number , {text:`Password is Incorrect ${creds[1]}`})
    }
    state.active_state = 'general';
    state.authorized = true;
     await write_states(formatted_number , state)
    await socket.sendMessage(formatted_number , {text:`Logged In!!\n\nWelcome ${checker.pushname} to Whatstore merchant Panel\n Here you can Upload all your products into our Stores\nAnd keep track of all Existing  as well as Finished orders,\nAlong with their payments `});
    await wait(2);
    await show_menu(socket,formatted_number);
    }
 }


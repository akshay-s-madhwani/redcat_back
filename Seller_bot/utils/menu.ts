import {wait , write_states , read_states } from './utility_methods';

export const show_menu = async(socket:any , number:string)=>{
  let state = await read_states(number);
  state.active_state = 'general';
 await write_states(number , state)
    if(!state || !Object.keys(state).includes('authorized') || !state.authorized){
      console.log(!Object.keys(state).includes('authorized'))
      console.log(!state)
      console.log(!state.authorized)
          const buttonMessage = {
              text:'*Menu*',
              buttons:[
                  {buttonId:`signin`, buttonText: {displayText: `Sign In`}, type: 1 },
                  {buttonId:`aboutus`, buttonText: {displayText: `About Us`}, type: 1 },
                  ],
                  headerType:4
          }
          await socket.sendMessage(number , buttonMessage)
        }
        else{
         const buttonMessage = await {
              text:`              *Main Menu*      `,
              buttons:[
                  {buttonId:`upload_product`, buttonText: {displayText: `Upload a product`}, type: 1 },
                  {buttonId:`view_products`, buttonText: {displayText: `View your Products`}, type: 1 },
                  {buttonId:`current_orders`, buttonText: {displayText: `Current Orders`}, type: 1 },
                  
                  ],
                  headerType:2
          }
          await socket.sendMessage(number , buttonMessage); 
          await socket.sendMessage(number , {
              text:'*__________________________________*',
            buttons:[
            {buttonId:`all_orders`, buttonText: {displayText: `All Orders`}, type: 2 },
                  {buttonId:`how`, buttonText: {displayText: `How does this work?`}, type: 2 },
                  {buttonId:`logout`, buttonText: {displayText: `Logout`}, type: 3 }],
                  headerType:2
          })
        }
}
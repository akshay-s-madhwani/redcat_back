const fs = require('fs');

export const Prefix = '@s.whatsapp.net';

export const possible_categories = ["men_clothing" , "women_clothing" , "accessories" , "jewellery" , "electronics"]

export const wait = (time:number) => {
    return new Promise((resolve, reject) => {
        setTimeout(() =>{ resolve(time)}, (Number(time) * Number(1000)))
    })
}

export const write_logs = (content:string)=>{
  if(!fs.existsSync('message_logs.json')){
    fs.writeFileSync('message_logs.json' , '[]')
  }
  let logs = JSON.parse(fs.readFileSync('message_logs.json','utf8'));
  logs.push(JSON.parse(content))
  fs.writeFileSync('message_logs.json',JSON.stringify(logs) , 'utf8');
}

export const read_states = (id:string)=>{
  let _id = String(id).replace(Prefix,'');
  return JSON.parse(fs.readFileSync(`./customer/${_id}_states.json` , 'utf8'))
}

export const write_states = (id:string , data:any)=>{
  let _id = id.replace(Prefix , '')
  fs.writeFileSync(`./customer/${_id}_states.json` , JSON.stringify(data));
}
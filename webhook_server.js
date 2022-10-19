const stripe = require('stripe');
const express = require('express');
const app = express();
const fs = require('fs');
const redis = new (require('ioredis'))()
const orderSchema  = require('./models/order_models');
const user_model = require('./models/user_model');
const seller_model = require('./models/seller_model');
const product_model = require('./models/product_model');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_1e042a3da636ecd0703eee1204159705467efd5d134586653a1fc53e9c5cdaa0";
const logicRedefinedKey = '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'

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  
  const sig = request.headers['stripe-signature'];

  let event;
  redis.publish('order_status_channel' , 'Started')
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    if(!fs.existsSync('./webhook_events.json')){
      fs.writeFileSync('./webhook_events.json','[]','utf8');
    }
    let old_events = JSON.parse(fs.readFileSync('./webhook_events.json','utf8'));
    old_events.push(event);
    fs.writeFileSync('./webhook_events.json', JSON.stringify(old_events) , 'utf8');
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(event.type)
  switch (event.type) {
    case 'cash_balance.funds_available':
      let cashBalance = event.data.object;
      // Then define and call a function to handle the event cash_balance.funds_available
      break;
    case 'checkout.session.async_payment_succeeded':
      let session = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      let status = event.data.object;
      let {metadata} = status;
      if(metadata){
        let {info , id , name , address , number , customer} = metadata;
        
        let sale_information = JSON.parse(info)
        
        console.log(sale_information)
        let new_order = new orderSchema({
          gross_price:status.amount_total/100,
          vat:0,
          discount:0,
          extra_charges:0,
          products:[],
          multi_seller:[]
        });
        
        let user_id;
        user_model.findOne({number})
        .then(data=>{
          console.log(data)
          console.log(data._id)
          user_id=data._id
          new_order['ordered_by'] = data._id
        });

        
        let all_sellers = sale_information.map(i=>i.soldBy)
        let sellers = Array.from(new Set(all_sellers));
        console.log(sellers)
        if(sellers.length === 1){
          seller_model.findOne({_id:sellers[0]})
          .then(seller_info=>{

          new_order.seller = seller_info;
          sale_information.map(i=>{
            new_order.products.push({
              product:i.product,
              quantity:i.quantity,
              properties:{...i.properties},
              amount:Number(i.product)*(Number(i.quantity)||1)
            })
          })
        })
        }else{
        for(let i of sellers){
          for(let j of sale_information){
            if(i === j.soldBy){
              seller_model.findOne({_id:i})
              .then(seller_info=>{
                new_order.multi_seller.push({
                  seller:i,
                  product:j.product,
                  quantity:j.quantity,
                  properties:j.properties
                })
                new_order.products.push({
                  product:j.product,
                  quantity:j.quantity,
                  properties:j.properties
                })
            })
          }
          }
        }
      }
      if(!number){
        user_model.findOne({_id})
        .then(data=>{
          number = data.number
        })
      }
      new_order.save()
      .then(saved_data=>{
        console.log('success')
        redis.publish('payment_status_channel' , JSON.stringify({...metadata, order_details:{...new_order},success:true,number}))
      })
      .catch(e=>{
        console.log(e)
        redis.publish('payment_status_channel' , JSON.stringify({...metadata, order_details:{...new_order},success:false,number}))
      })
      
}else{
  console.log(session)
}
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'payment_intent.amount_capturable_updated':
      
      // Then define and call a function to handle the event payment_intent.amount_capturable_updated
      break;
    case 'payment_intent.canceled':
      
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case 'payment_intent.created':
      
      // Then define and call a function to handle the event payment_intent.created
      break;
    case 'payment_intent.partially_funded':
      
      // Then define and call a function to handle the event payment_intent.partially_funded
      break;
    case 'payment_intent.payment_failed':
      
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case 'payment_intent.processing':
      
      // Then define and call a function to handle the event payment_intent.processing
        break;
    case 'payment_intent.requires_action':
      
      // Then define and call a function to handle the event payment_intent.requires_action
      break;
    case 'payment_intent.succeeded':
      
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case 'payment_link.created':
      let paymentLink = event.data.object;
      // Then define and call a function to handle the event payment_link.created
      break;
    case 'payment_link.updated':
      
      // Then define and call a function to handle the event payment_link.updated
      break;
    case 'payout.canceled':
    // Then define and call a function to handle the event payout.canceled
      break;
    case 'payout.created':
    // Then define and call a function to handle the event payout.created
      break;
    case 'payout.failed':
    // Then define and call a function to handle the event payout.failed
      break;
    case 'payout.paid':
    // Then define and call a function to handle the event payout.paid
      break;
    case 'payout.updated':
    // Then define and call a function to handle the event payout.updated
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, '0.0.0.0', () => console.log('Running on port 4242'));
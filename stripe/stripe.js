const Stripe = require('stripe');
const stripe = Stripe('');

//Create PaymentIntent Object
(async()=>{
const paymentIntent = await stripe.paymentIntents.create({
	amount:400,
	currency:'hkd',
	automatic_payment_methods:{enabled:true},
	payment_method:'alipay'
	
});
await console.log(paymentIntent)
// const confirmpayment = await stripe.paymentIntents.confirm(paymentIntent.id,{
// 	receipt_email:'asmfreelancer99@gmail.com',
// 	payment_method: ['Alipay']
// })
// await console.log(confirmpayment)
})


c = async ()=>{
const product = await stripe.products.create({
  name: 'Gold Special',
  description:"Something ver gold and very special",
  default_price_data:{
  	currency:'hkd',
  	unit_amount:2000
  }
});
await console.log(product);



const paymentLink = await stripe.paymentLinks.create({
  line_items: [
    {
      price: product.default_price,
      quantity: 1,
    },
  ],
  payment_method_types:['alipay']
});
await console.log(paymentLink)
};

c()
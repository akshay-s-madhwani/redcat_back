const { mkdirSync , existsSync , writeFileSync}  = require('fs');
let uuid = require('uuid')
let productSchema = require('../../../../models/product_model.js');
const seller_model = require('../../../../models/seller_model.js');


// @Method POST
// @data : 
// --- Product [Obect (array)] 
// --- keys =>  title , image , price , originalPrice , category , description , stock , properties 

module.exports = async (req, res) => {
    let { product } = await req.body;
    let { category, title, image , imageFileName , number , price, originalPrice, currency , description, stock, properties , seller_id } = product
    let product_exists = await productSchema.findOne({ title });
    if (product_exists) {
        if (product_exists.category === category) {
            return res.status(400).json({ success:false , message: "Product with same name Already Exists, Please try another name" });
        }
    }
    if (isNaN(price) || isNaN(originalPrice) || isNaN(stock)){
    	return res.status(400).json({success:false , message:"Invalid Data, Price and Stock amount should be Digits without any symbols"})
    }
    if(!price){
    	return res.status(400).json({success:false , message:"Price is Required"});
    }
    if(!stock){
    	return res.status(400).json({success:false , message:"Stock is Required"});
    }
    if(!title){
    	return res.status(400).json({success:false , message:"Title is Required"});
    }
    if(!category){
    	return res.status(400).json({success:false , message:"category is Required"});
    }
    
    function decodeBase64Image(dataString) 
    {
      let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let response = {};

      if (matches.length !== 3) 
      {
        return {type:'errored',data:''};
      }

      response.type = matches[1];
      response.data = Buffer.from(matches[2], 'base64');

      return response;
    }

    let new_product = new productSchema({
        title,
        image,
        hasImage:true,
        price,
        originalPrice,
        category,
        currency,
        description,
        stock,
        properties,
        reviews:[],
        rating:{count:0,rate:0},
        added_by: 'seller'
    });
    if(image.startsWith('data:')){
     new_product.imageData = image;
     
     
        source_path = 'static/images';
        imageBuffer = await decodeBase64Image(image);
    if(!existsSync(`../../${source_path}/${number}`)){
        mkdirSync(`../../${source_path}/${number}`)
    }
    new_product.image = `${source_path}/${number}/${imageFileName}.${imageBuffer.type.split('/')[1].replace('jpeg','jpg')}`  ;
     writeFileSync(`../../${source_path}/${number}/${imageFileName}.${imageBuffer.type.split('/')[1].replace('jpeg','jpg')}`,imageBuffer.data)
     
    }
    	console.log(new_product);
    await new_product.save()
        .then(product => {
            seller_model.findOne({seller_id})
            .then(async seller=>{
                await seller.products_uploaded.push(product._id)
                await seller.save();
            });
            return res.json({success:true ,  ...new_product });
        })
        .catch(e => {
            console.log(e)
            res.status(400).json({ message: "Error occured while saving product" });
        })

}
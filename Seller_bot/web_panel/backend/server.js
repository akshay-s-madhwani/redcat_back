const mongoose = require('mongoose')
const axios = require('axios');
const express = require('express');
const https = require('https');
const ejs_layout = require('express-ejs-layouts');
const helmet = require('helmet');

const bodyParser = require('body-parser')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const fs = require('fs');
const path = require('path')
require('dotenv').config({path:'../../../.env'})

const product_routes = require('./routes/product_routes');
const order_routes = require('./routes/order_routes');
const account_routes = require('./routes/account_routes');

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json({limit:'1050mb'}))
app.use(express.urlencoded({extended:true,limit:'1050mb'}))
app.use(morgan('combined'))

//body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const httpsOptions={
	key : fs.readFileSync('./key.pem'),
	cert : fs.readFileSync('./certificate.crt'),
	}

//connect to mongoose {returns promise}
const db = process.env.MONGO_URI;
//mongoose.set('debug',true)
// mongoose
// .connect(db, {
//   useUnifiedTopology : true,
//   useNewUrlParser : true
// })
// .then(()=> console.log('MongoDB connected '))
// .catch(err => console.log(err));

//ejs setup
// app.use(express.static('static'))
// app.use('/css' , express.static('static/css'))
// app.use('/js' , express.static('static/js'))
// app.use(ejs_layout)
// app.set('layout' , './home')
// app.set('view engine','ejs')
app.use(cookieParser());

app.use((req,res,next)=>{
    console.log(req.body);
    next()
})
app.use(product_routes);
app.use(order_routes);
app.use(account_routes);
app.get('/hello',(req,res)=>{
	res.send('Hello World');
	})

const PORT = process.env.PORT || 8443;
https.createServer(httpsOptions , app).listen(PORT ,'0.0.0.0' ,()=>console.log(`Server Listening on ${PORT}`)); 
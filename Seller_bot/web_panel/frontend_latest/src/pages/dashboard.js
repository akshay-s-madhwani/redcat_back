import React , { useState , useEffect, useCallback, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import Table from 'react-bootstrap/Table';

import Layout from '../components/layout';
import { get_seller_details } from '../api_handlers/dashboard_api';
import { get_products } from '../api_handlers/products_api';
import product_icon from '../images/product_icon.png';
import shop_icon from '../images/shop_icon.png';
import order_icon from '../images/order_icon.png';
import { get_orders } from '../api_handlers/order_api';

import Piechart from '../components/Piechart';
import Barcharts from '../components/Barcharts';
import { isBrowser } from '../utils/isBrowser';

const bar_data = [
	{
	  name: 'Product A',
	  Ordered: 2,
	  Delivered: 1,
	  amt: 1,
	},
	{
	  name: 'Product B',
	  Ordered: 4,
	  Delivered: 3,
	  amt: 1,
	},
	{
	  name: 'Product C',
	  Ordered:5,
	  Delivered: 6,
	  amt: 1,
	},
	{
		name: 'Product D',
		Ordered: 6,
		Delivered: 5,
		amt:1,
	  },
	  {
		name: 'Product E',
		Ordered: 4,
		Delivered: 3,
		amt: 1,
	  },
	
  ];
  

const centerSingleElement = {
	display:'flex',
	justifyContent:'center',
	alignItems:'center'
}

const page_wrapper = { padding:'35px 0px 0 1.5rem',width:'100%', maxWidth:'95rem' ,height:'100vh',overflowY: 'auto',overflowX:'hidden' }

const tiles = {
	display:'flex',
	gap:7,
	flexFlow:'column',
	alignItems:'center',
	color:"#fff",
	padding:'2rem 0',
	borderRadius:10,
	background: '#6477c2'
}
const iconWrap = {
	display: 'grid',
    width: 60,
    background: 'rgb(243 255 186)',
    height: 60,
    placeItems: 'center',
    borderRadius: '50%'
}
const icon =  {
	 width:24
	}
const overall_wrap = {
	display:'flex',
	flexFlow:'column',
	height:'36.5rem',
	borderRadius:10,
	background:'#333',
	marginTop:'3.2rem',
	paddingLeft:'25px',
	alignSelf:'center'
}

const overall_tiles = {
	display:'flex',
	width:'5rem',
	borderRadius:10
}

const overall_flex_wrap = {
	display:'flex',
	height:'80%',
	flexFlow:'column',
	justifyContent:'space-between'
}

const overall_data = {
	display:'flex',
	flexFlow:'column',
	color:'#fff'
}
const pie_header = {
	position: 'absolute',
			top: '30%',
			left: '10%',
			fontSize:18,
			fontWeight:700
}
const overall_icons = {width:36,height:36,margin:'auto 1rem', filter:'invert(1)'}
export default function Dashboard() {
	if(typeof window !== 'undefined'){
	const collapsed_state = localStorage.getItem('collapsed');
	console.log(collapsed_state)
	const [seller , setSeller] = useState([]);
	const [order , setOrder] = useState([]);
	const [potential , setPotential] = useState([]);
	const [collapsed , setCollapsed] = useState(false);
	const [revenue , setRevenue] = useState(0);
	const [ barData , setBarData ] = useState(bar_data);
	const [pieRevenue , setPieRevenue] = useState([
		{ name: 'Current', value: 0 },
		{ name: 'Total' , value : 0}
	])
	const [ pieOrders , setPieOrders] = useState([
		{ name: 'Received', value: 0 },
		{ name: 'Delivered' , value : 0}
	  ])
	const [ piePurchase , setPiePurchase] = useState([
		{ name: 'Actual', value: 0 },
		{ name: 'Potential' , value : 0}
	  ])
	const [monthlyData , setMonthlyData] = useState([])
	let store_ = JSON.parse(localStorage.getItem('store_'))
	useEffect(()=>{
		get_seller_details()
		.then(data=>{			
			setSeller(data);
			let products = data.seller.products_uploaded;
			let potential_ = [];
			for(let i of products){
				if(!i.potentialPurchase.length){continue}
				for(let j of i.potentialPurchase){
					potential_.push({...j , title:i.title})
				}
			}
			console.log(potential_)
			setPotential(potential_);
		console.log(potential_)});

		get_orders()
		.then(data=>setOrder(data))
		.catch(e=>{console.log(e)})
		console.log(order)
	},[]);
	
	useEffect(()=>{
		localStorage.setItem('collapsed' ,collapsed);
	},[collapsed])
	useEffect(()=>{
		let thisMonth = new Date().getMonth()+1;
		let thisYear = new Date().getYear()+1900;
		let monthly = {
		order:{ordered:0,delivered:0},
		purchase:{potential:0,actual:0},
		revenue:{current:0 , total:0}
		}
		console.log(seller.seller )
		console.dir(order.order)
		if(seller.seller && order.order){
		monthly.purchase.potential = seller.seller.products_uploaded.reduce((acc , cur)=>{
			// if(cur.potentialPurchase.length){
				let value = cur.potentialPurchase.filter(i=>
					i.number && new Date(i.on).getMonth()+1 === thisMonth && new Date(i.on).getYear()+1900 === thisYear
					).length;
					console.log(value)
			return acc + value;
			// }
		
		},0);
		monthly.purchase.actual = order.order.filter(i=>{
			let order_date = new Date(i.created_on);
			if(order_date.getMonth()+1 === thisMonth && order_date.getYear()+1900 === thisYear){
				return i
			}
		}).length;

		monthly.order.ordered = order.order.filter(i=>{
			let order_date = new Date(i.created_on);
			console.log(order_date)
			if(order_date.getMonth()+1 == thisMonth && order_date.getYear()+1900 == thisYear){
				return i
			}
		}).length

		monthly.order.delivered = order.order.filter(i=>{
			let order_date = new Date(i.created_on);
			if(order_date.getMonth()+1 === thisMonth && order_date.getYear()+1900 === thisYear){
				if(i.delivery_status !== 'order_placed'){return i}
			}
		}).length

		let current = order.order.filter((i)=>{
			let order_date = new Date(i.created_on);
			if(order_date.getMonth()+1 === thisMonth && order_date.getYear()+1900 === thisYear){
					return i
			}
		});
		
		monthly.revenue.current = current.reduce((i,j)=>i+j.gross_price,0)

		monthly.revenue.total = order.order.reduce((i,j)=>i+j.gross_price,0)
		
		console.log(monthly)
		setPieOrders([
			{ name: 'Received', value: monthly.order.ordered },
			{ name: 'Delivered' , value : monthly.order.delivered}
		])

		setPieRevenue([
			{ name: 'Current', value: monthly.revenue.current },
		{ name: 'Total' , value : monthly.revenue.total}
		])

		setPiePurchase([
			{ name: 'Actual', value: monthly.purchase.actual },
			{ name: 'Potential' , value : monthly.purchase.potential }
		]);
	}else{
		console.log(seller.seller)
	}
	},[seller , order])

	// useEffect(i=>{
	// 	let ordered_products = order.order.filter(i=>i.products);

	// },[seller])
	useMemo(()=>{
		
		Object.keys(order).length?order.order.map(i=>setRevenue(j=>j+=i.gross_price)):0
		
	},[order]);
	
	useEffect(()=>console.log(pieOrders),[pieOrders])

	
	return(
<Layout selected={'home'}>
		
		<Container style={page_wrapper}>
		<Row>
		<Col lg={9} sm={12}>
		<Row>
		<Col style={{display:'flex',alignItems:'baseline'}}>
		<h2 style={{margin:'0 0.5rem',whiteSpace:'pre'}}>Welcome to</h2>
		<h4 style={{fontWeight:700,whiteSpace:'pre'}}>{store_.name||'Store'}'s Panel</h4>
		</Col>
		<Col></Col>
		</Row>
		<Row className="px-sm-3 px-md-2">
		<Col lg={4} md={6} sm={12} className="mb-md-2 my-sm-3" >
		<div style={tiles}>
		<div style={iconWrap}>
		<img style={{...icon , filter:'invert(1)'}} src={product_icon}/>
		</div>
		<h6 style={{fontSize:18, color:'#fff'}}>Products</h6>
		<h2>{Object.keys(seller).length?seller.seller.products_uploaded.length:0}</h2>
		<h6 style={{fontSize:14 , color:'#fff'}}>Uploaded</h6>
		</div>
		</Col>
		<Col lg={4} md={6} sm={12} className="mb-md-2 my-sm-3">
		<div style={tiles}>
		<div style={iconWrap}>
		<img style={{...icon }} src={order_icon}/>
		</div>
		<h6 style={{fontSize:18, color:'#fff'}}>Orders</h6>
		<h2>{Object.keys(order).length?order.order.length:0}</h2>
		<h6 style={{fontSize:14 , color:'#fff'}}>Active</h6>
		</div>
		</Col>
		<Col lg={4} md={12} sm={12} className="my-sm-3">
		<div style={tiles}>
		<div style={iconWrap}>
		<img style={{...icon }} src={shop_icon}/>
		</div>
		<h6 style={{fontSize:18, color:'#fff'}}>Sales</h6>
		<h2>{Object.keys(order).length?order.order.filter(i=>i.delivery_status === 'delivered').length:0}</h2>
		<h6 style={{fontSize:14, fontWeight:500 , color:'#fff'}}>Made</h6>
		</div>
		</Col>
		</Row>

		<Row style={{paddingRight:'1.2rem'}}>
		
		<Row  style={{borderRadius:10,background:'#010f23bf', boxShadow:'inset 3px 2px 10px 0px #bec3d4', color:'#fff' , height:'20rem',margin:'.2rem 0 0 1rem' , width:'99.5%' , display:'flex' , flexFlow:'column'}}>
		<h3 style={{margin:'.7rem 20px',padding:'1rem 0',color:'#fff !important'}}>This Month</h3>
		<div style={{display:'flex',marginTop:'-6rem' , justifyContent:'space-around', color:'#fff'}}>
		<Col style={{position:'relative'}} >
		<p
		style={pie_header}>Orders Completed</p>
		<Piechart data={pieOrders}/>
		</Col>
		<Col style={{position:'relative'}} >
		<p
		style={pie_header}>Projected Purchases</p>
		<Piechart data={piePurchase}/>
		</Col>
		<Col style={{position:'relative'}} >
		<p
		style={pie_header}>Revenue This Month</p>
		<Piechart data={pieRevenue}/>
		</Col>
		</div>
		</Row>
		</Row>
		</Col>
		
		
		<Col lg={3} sm={9} className="my-sm-2" style={{marginTop:'5.6rem',paddingBottom:'.2rem'}}>
		<div style={overall_wrap}>
		<h2 style={{color:'#fff' , margin:'1rem',wordBreak:'break-word'}}>Overall Performance</h2>
		<div style={overall_flex_wrap}>
		<div style={overall_tiles}>
		<img src={order_icon} style={overall_icons}/>
		<div style={overall_data}>
		<h6>Total Sales</h6>
		<h3>{Object.keys(order).length?order.order.filter(i=>i.delivery_status === 'delivered').length:0}</h3>
		</div>
		</div>
		<hr style={{marginLeft:'-1.5rem'}}/>
		<div style={overall_tiles}>
		<img src={order_icon} style={overall_icons}/>
		<div style={overall_data}>
		<h6>Revenue Generated</h6>
		<h3>{revenue}</h3>
		</div>
		</div>
		<hr style={{marginLeft:'-1.5rem'}}/>
		<div style={overall_tiles}>
		<img src={order_icon} style={overall_icons}/>
		<div style={overall_data}>
		<h6>Potential Purchase</h6>
		<h3>{potential.length?potential.filter(i=>i.name).length:0}</h3>
		</div>
		
		</div>
		
		
		</div>
		</div>
		</Col>
		</Row>
		<Row lg={12} className="mb-4 ps-md-2 ps-sm-2">
		<Row>
		<h4>Potential Purchases</h4>
		<p>A list of Products Customers were interested in , that may / may not , have been purchased</p>
		</Row>
		<Row style={{background:'#eee',overflowX:'scroll'}}>
		<Table striped>
		<thead>
		<th scope="col">#</th>
		<th scope="col">Name</th>
		<th scope="col">Number</th>
		<th scope="col">Product</th>
		<th scope="col">Type</th>
		<th scope="col">On</th>
		</thead>
		<tbody>
		{
			potential.map((i,j)=>{
				if(i.number){
				return(
				<tr>
				<td>{j}</td>
				<td>{i.name}</td>
				<td>{i.number}</td>
				<td>{i.product}</td>
				<td>{i.Type}</td>
				<td>{new Date(i.on).toLocaleString()}</td>

				</tr>
				)}
			})
		}
		</tbody>
		</Table>
		</Row>
		</Row>
		</Container>
		
</Layout>
)
	}else{return null}
	}
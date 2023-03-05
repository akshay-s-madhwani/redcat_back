import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Navbar from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab';
import CloseButton from 'react-bootstrap/CloseButton';
import { get_orders, update_order } from '../api_handlers/order_api';
import Table from 'react-bootstrap/esm/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { SearchSVGIcon } from '@react-md/material-icons';



const wrapper = {
	display: 'flex',
	height: 'calc(100vh)',
	background:'rgb(250,250,250)'
}
const FloatWindow = {
	position: 'absolute',
	top: '20vh',
	background: '#333a',
	width: '100vw',
	height: '100vh',
	display: 'grid',
	transform: 'translate(0vw , -20vh)',
	placeItems: 'center',
}

const page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', paddingLeft: '12.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }
const collapsed_page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', paddingLeft: '6.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }

const dropContainer = {
	background: '#fff',
	placeItems: 'center',
	isolation: 'isolate',
	minWidth: '60vw',
	padding: '3rem',
	borderRadius: '10PX',
	height: 'fit-content',
	boxShadow: '0 0 0 10px #333c',
}

const card = {	
    width: '25rem',
    padding: '2rem',
    margin: '1rem',
    boxShadow: '0 0 30px 3px #3335'
}


export default function Orders(){
	if(typeof window !== 'undefined'){
	const collapsed_state = localStorage.getItem('collapsed');
    const [tab , setTabs] = useState('active');
    const [activeOrders , setActiveOrders] = useState([]);
	const [completedOrders , setCompletedOrders] = useState([]);
	const [orders , setOrders] = useState([]);
	const [reload , setReload] = useState([]);
	const [isPopup , setIsPopup] = useState(false);
	const [selected , setSelected] = useState({});
	const [ status , setStatus ] = useState('');
	const [ saveChanges , setSaveChanges ] = useState(false);
	const [error , setError] = useState('');
	const [collapsed , setCollapsed] = useState(false);

	useEffect(()=>{
		localStorage.setItem('collapsed' ,collapsed);
	},[collapsed])
	
    useEffect(()=>{
        get_orders()
		.then(data=>{
			console.log(data)
			if(data){
			if(data.order.length){
				for(let items of data.order){
					for(let product of items.products){
					items.amount?items.amount+=Number(product.product.price)*Number(product.quantity):items.amount=Number(product.product.price)*Number(product.quantity)
				}
				}
			setActiveOrders([...data.order.filter(i=>(i.order_status !== 'completed')&&(i.delivery_status !== 'delivered'))])
			setCompletedOrders([...data.order.filter(i=>(i.order_status === 'completed')||(i.delivery_status === 'delivered'))])
			setIsPopup(false)
			}
			else{
				setError('No Orders have been made till now')
			}
		}
		
		})
		.catch(e=>{
		console.log(e)
		setError('Something Went wrong While looking for Invoices ')
		})
    },[reload]);

	useEffect(()=>{setOrders([...activeOrders])},[activeOrders])
	
	useEffect(()=>{
		console.log(tab)
		if(tab === 'active'){
			setOrders([...activeOrders]);
		}
		else{
			setOrders([...completedOrders]);
		}
	},[tab]);

	
	const showOrder = (e)=>{
		let key = e.target.parentElement.dataset.key;
		console.log(key)
		console.log(e.target.parentElement)
		if(orders.length){
			
			console.log(e.target.parentElement)
			setIsPopup(true);
			setSelected({...orders[Number(key)]});
		}
	}

	const saveStatus = async(invoice , delivery)=>{
		const updated_order = await update_order(invoice , delivery);
		console.log(updated_order)
		setSaveChanges(false);
		let current_order = updated_order.order;
		if((current_order.order_status !== 'completed')&&(current_order.delivery_status !== 'delivered')){
			setActiveOrders(i=>{
				let order_index = i.filter((i,j)=>{if(i.invoice_number === current_order.invoice_number){return j}});
				if(order_index){
				i[order_index] = current_order;}
				return [...i];
			})
		}else{
			setCompletedOrders(i=>{
				let order_index = i.filter((i,j)=>{if(i.invoice_number === current_order.invoice_number){return j}});
				if(order_index){
				i[order_index] = current_order;}
				return [...i];
			})
		}
		setReload(Math.random()*50)
	}

	useEffect(()=>{console.log(selected)},[selected])
    return(
        <Layout>
			

			<div id="wrapper" style={wrapper}>
				<Sidebar selected='orders' collapsed={collapsed}  setCollapsed={setCollapsed}/>
				{error ? 
				<div style={{width: '100vw', height: 'calc(100vh)',background:'azure',display:'grid',placeItems:'center'}}>
				<p>{error}</p>
				</div>
					:
					(isPopup && Object.keys(selected).length) ? 
					<div style={FloatWindow}>
						<div style={dropContainer}>
							<CloseButton onClick={() => setIsPopup(false)} style={{ float:'right' , margin:'-1.5rem' }} />
							
							<div style={{borderRadius: 10,
								boxShadow: '0 1px 30px 1px #3335',
								padding: '2rem'}}>
							<header>
							<p>Date : {new Date(selected.created_on).toLocaleString()}</p>
							<p>Invoice No.{selected.invoice_number}</p>
							<h6>Customer Name: Akshay</h6>
							
							<h6>Address: Rf/23 , new street , Hunghom , hongkong</h6>
							</header>
							<article>
							<Table>
							<thead>
							<tr>
							<th>No.</th>
							<th >Product Name</th>
							<th>Quantity</th>
							<th>Price ($HKD)</th>
							<th>Added cost ($HKD)</th>
							<th>Amt.($HKD)</th>
							</tr>
							</thead>
							<tbody>
							{
								selected.products.length?
								selected.products.map((i,j)=>{
									return(
										<tr>
										<td>{j}</td>
										<td>
										<p style={{margin:'10px 0'}}><b>{i.product.title}</b></p>
										<p style={{margin:0}}>{i.properties.length?(Object.entries(i.properties[0]).map(i=>i.join(' : ')).join('  ')):null}</p>
										</td>
										<td>{i.quantity}</td>
										<td>{i.product.price}</td>
										<td>{i.extra_charges}</td>
										<td>{Number(i.quantity)*Number(i.product.price)}</td>
										</tr>
									)
								})
								:
								<tr><td colspan="6" style={{textAlign:'center'}}>No Products found</td></tr>
							}
							
							</tbody>
							<tfoot>
							<tr>
							<td colspan={5}><b>Total</b></td>
							<td>{selected.gross_price}</td>
							</tr>
			
							</tfoot>
							</Table>
							</article>
							<div>
							<p>Delivery Status:</p>
							
							
							
				
					
						<Form.Select size={'md'} data-invoice={selected.invoice_number} onChange={(e) => {setStatus( e.target.value); setSaveChanges(true)}}>
					
					{selected.delivery_status === 'order_placed' && (
						<>
						<option value="null">Order Placed</option>
					<option value="en-route">En-Route</option>
					<option value="delivered">Delivered</option>
					</>
					)}
					{selected.delivery_status === 'en-route' && (
						<>
					<option value="null">En-Route</option>
					<option value="delivered">Delivered</option>
					</>
					)}
					{status === 'delivered' && (
						<b>Delivered</b>
					)}
					</Form.Select>
							{		
								saveChanges?
								<Button style={{margin:'15px 0'}} onClick={()=>saveStatus(selected.invoice_number , status)}>Save Changes</Button>
								:null								
							}
							</div>
							</div>
						</div>
					</div>
					:
					
				<div style={
					collapsed ? page_wrapper :  collapsed_page_wrapper
					}>
			
					<h3 style={{ marginTop: "2rem" }}>Received Orders</h3>
					<p>Make sure to Update Status of Order as "En-Route" As soon is it Sent for shipping</p>
					<Tabs
					activeKey={tab}
					onSelect={(k)=>setTabs(k)}
					className="mb-3">
					<Tab
					eventKey="active"
					title="Active Orders">
					<div>
					<div>
					<InputGroup>
					<Form.Control placeholder="Search by invoice No."
					aria-label="Search invoices by invoice no."  
					type="search"/>
					<Button variant="outlined-primary" >
					<SearchSVGIcon/>
					</Button>
					</InputGroup>
					</div>
					<Table >
					
					<thead>
					<th>
					Status
					</th>
					<th>Date</th>
					<th>Invoice No.</th>
					<th>Customer</th>
					<th>Item</th>
					<th>Options</th>
					<th>Qty.</th>
					<th>Rate (HK$)</th>
					<th>Amount (HK$)</th>
					</thead>
					<tbody>
					
					{
						orders.length?
						orders.map((i,j)=>{
							return(
							<tr onClickCapture={(e)=>showOrder(e)} data-key={j} key={j} style={{verticalAlign:'middle'}}>
							<td onClick={(e)=>showOrder(e)} style={{borderRadius:'10px 0 0 10px' , padding:'1.5rem 0' , textAlign:'center', background:(i.delivery_status==='order_placed')?'#65f265':'#65e0f2',fontWeight:'700'}}>{i.delivery_status}</td>
							<td>{new Date(`${i.created_on}`).toLocaleString()}</td>
							<td>{i.invoice_number?i.invoice_number:`00${j}`}</td>
							<td>Customer</td>
							{
								i.products.map((data , index)=>{
									return(
										<>
									<td>
									<p style={{margin:'1.2rem 0 0 0'}}><b>{(i.products.length>1)?index:null}</b>{data.product.title}</p><br/>
									</td>
									<td>
									{
										
										data.properties.map(prop=>{
											console.log(prop)
											return(
												<>
												<p style={{margin:0}}><b>Color</b> : {prop.colors?prop.colors:'-'}</p>
												<p style={{margin:0}}><b>Size</b> : {prop.sizes?prop.sizes:'-'}</p>
												<p style={{margin:0}}><b>Variation</b> : {prop.variations?prop.variations:'-'}</p>
										</>
											)
										})
									}
									</td>
									<td>{data.quantity}</td>
									<td>
									{Number(data.product.price)}
									</td>
									
									</>
									)
								})
							}
							
							<td>{i.amount}</td>
							<td></td>
							<td></td>
							</tr>
							)
									
					})
					:null
				}
					</tbody>
					</Table>
					</div>
					</Tab>
					<Tab
					eventKey="completed"
					title="Completed Orders"
					>
					<div>
					<div>
					<InputGroup>
					<Form.Control placeholder="Search by invoice No."
					aria-label="Search invoices by invoice no." />
					<Button variant="outlined-primary" >
					<SearchSVGIcon/>
					</Button>
					</InputGroup>
					</div>
					<Table className="hover">
					
					<thead>
					<th>
					Status
					</th>
					<th>Date</th>
					<th>Invoice No.</th>
					<th>Customer</th>
					<th>Item</th>
					<th>Options</th>
					<th>Qty.</th>
					<th>Rate (HK$)</th>
					<th>Amount (HK$)</th>
					</thead>
					<tbody>
					
					{
						orders.length?
						orders.map((i,j)=>{
							return(
							<tr onClick={(e)=>showOrder(e)} data-key={j} key={j} style={{verticalAlign:'middle'}}>
							<td style={{borderRadius:'10px 0 0 10px' , padding:'1.5rem 0' , textAlign:'center', background:(i.delivery_status==='order_placed')?'#65f265':'#65e0f2',fontWeight:'700'}}>{i.delivery_status}</td>
							<td>{new Date(`${i.created_on}`).toLocaleString()}</td>
							<td>{i.invoice_number?i.invoice_number:`00${j}`}</td>
							<td>Customer</td>
							{
								i.products.map((data , index)=>{
									return(
										<>
									<td>
									<p style={{margin:'1.2rem 0 0 0'}}><b>{(i.products.length>1)?index:null}</b>{data.product.title}</p><br/>
									</td>
									<td>
									{
										
										data.properties.map(prop=>{
											console.log(prop)
											return(
												<>
							
												<p style={{margin:0}}><b>Color</b> : {prop.colors?prop.colors:'-'}</p>
												<p style={{margin:0}}><b>Size</b> : {prop.sizes?prop.sizes:'-'}</p>
												<p style={{margin:0}}><b>Variation</b> : {prop.variations?prop.variations:'-'}</p>
												</>
											)
										})
									}
									</td>
									<td>{data.quantity}</td>
									<td>
									{Number(data.product.price)}
									</td>
							
									</>
									)
								})
							}
							
							<td>{i.amount}</td>
							<td></td>
							<td></td>
							</tr>
							)
									
					})
					:null
				}
					</tbody>
					</Table>
					</div>
			
					</Tab>
					</Tabs>
				</div>
				}
			</div>
		</Layout>
    )
}
										}
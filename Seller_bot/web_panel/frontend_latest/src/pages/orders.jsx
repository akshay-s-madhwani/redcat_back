import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { Chip , TablePagination } from '@mui/material';

import Layout from '../components/layout';
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
import '../components/style/orders_default.css'



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

const page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', paddingLeft: '1.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }
const collapsed_page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', paddingLeft: '1.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }

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

const table_base = {
	borderRadius: 15,
    background: "#dfdfe6",
    padding: "2rem 0px 3rem 2rem",
    margin: "1rem 0",
	width:"max-content",
	minWidth:'85vw'
}

const table_wrapper = {
    width: "97%",
    borderRadius: 15,
    boxShadow: "-4px 1px 9px 1px #999",
	background:"#fff",
	overflow:'hidden'
}


export default function Orders(){
	if(typeof window !== 'undefined'){
	const collapsed_state = localStorage.getItem('collapsed');
    const [tab , setTabs] = useState('active');
    const [activeOrders , setActiveOrders] = useState([]);
	const [completedOrders , setCompletedOrders] = useState([]);
    const [tempActiveOrders , setTempActiveOrders] = useState([]);
	const [tempCompletedOrders , setTempCompletedOrders] = useState([]);
	const [page , setPage] = useState(0);
	const [ rowsPerPage , setRowsPerPage ] = useState(10);
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
			setTempActiveOrders([...data.order.filter(i=>(i.order_status !== 'completed')&&(i.delivery_status !== 'delivered'))])
			setCompletedOrders([...data.order.filter(i=>(i.order_status === 'completed')&&(i.delivery_status === 'delivered'))])
			setTempCompletedOrders([...data.order.filter(i=>(i.order_status === 'completed')&&(i.delivery_status === 'delivered'))])
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
			setPage(0)
		}
		else{
			setOrders([...completedOrders]);
			setPage(0)
		}
	},[tab]);

	const searchOrder = (e)=>{
		let keyword = e.target.value;
		if(tab === "active"){
			if(!keyword){
				setActiveOrders(tempActiveOrders)
			}
			setActiveOrders((i)=>{
					let filtered_orders = i.filter(orders=> orders.invoice_number && String(orders.invoice_number).includes(keyword))
					if(filtered_orders.length){
						return filtered_orders;
					}else{
						return setActiveOrders(tempActiveOrders)
					}
			}
			)
		}else{
			console.log(tab)
			if(!keyword){
				setCompletedOrders(tempCompletedOrders)
			}
			setCompletedOrders((i)=>{

					let filtered_orders = i.filter(orders=> orders.invoice_number && String(orders.invoice_number).includes(keyword))
					console.log(filtered_orders)
					if(filtered_orders.length){
						return filtered_orders;
					}else{
						return setCompletedOrders(tempCompletedOrders)
					}
			}
			)
		}
	}

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

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	  };
	
	  const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	  };

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
	const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

	useEffect(()=>{console.log(selected)},[selected])
    return(
        <Layout selected="Home">
			
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
							<h6>Customer Name: {(Object.keys(selected).includes('ordered_by') && selected.ordered_by && selected.ordered_by.pushname)?selected.ordered_by.pushname:"Unknown"}</h6>
							<h6>Customer Number: {(Object.keys(selected).includes('ordered_by') && selected.ordered_by && selected.ordered_by.number)?selected.ordered_by.number:"Unknown"}</h6>
							
							<h6>Address: {(Object.keys(selected).includes('ordered_by') && selected.ordered_by) ? (selected.ordered_by.hasAddress && selected.ordered_by.address ) ? selected.ordered_by.address.text : "<a href=`https://www.google.com/maps/search/?api=1&query=${selected.ordered_by.location.latitude},${selected.ordered_by.location.longitude}` target=`blank_`></a>" : "Unknown"}</h6>
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
								selected.products ?
								(selected.products.length?
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
								):
								null
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
					onChange={searchOrder}
					type="search"/>
					<Button variant="outlined-primary" >
					<SearchSVGIcon style={{width:20}}/>
					</Button>
					</InputGroup>
					</div>
					<div style={table_base}>
					<div style={table_wrapper}>
					<Table style={{tableLayout:"fixed" , width:"auto", minWidth:"100%"}}>
					
					<thead style={{background:"#000" , color:"#eee", height:'3rem'}}>
					
					<th>Date</th>
					<th>Invoice No.</th>
					<th>Customer</th>
					<th>Status</th>
					<th>Item</th>
					<th>Options</th>
					<th>Qty.</th>
					<th>Rate (HK$)</th>
					<th>Amount (HK$)</th>
					</thead>
					<tbody>
					
					{
						orders.length?
						(rowsPerPage > 0
							? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							: orders
						  ).map((i,j)=>{
							
								let name = (Object.keys(i).includes('ordered_by') && i.ordered_by && i.ordered_by.pushname) ? i.ordered_by.pushname : "Customer";
								return(
								<tr onClickCapture={(e)=>showOrder(e)} data-key={j} key={j} style={{verticalAlign:'middle'}}>
								<td>{new Date(`${i.created_on}`).toLocaleString()}</td>
								<td>{i.invoice_number?i.invoice_number:`00${j}`}</td>
								<td>{name}</td>
								<td onClick={(e)=>showOrder(e)}> <Chip color={i.delivery_status==='order_placed'?'success':'primary'} label={i.delivery_status}/></td>
								<td>
								{
									i.products.map((data , index)=>{
										return(
											<div>
											<p style={{ margin: '1.2rem 0 0 0'}}><b>{(i.products.length > 1) ? `${index}.` : null}{' '}</b><b>{data.product.title}</b></p><br />
											</div>
											)
										})
									}
								</td>
								
								<td>
								{
									i.products.map( data =>
											
										(
											<>
											{
											data.properties.map(function(options){
												return (	
													<div>
													
														<p><b>Color</b> : {options.colors}</p>
														<p><b>Size</b> : {options.sizes}</p>
														<p><b>Variation</b> : {options.variations}</p>
														{data.properties.length > 1 ? <hr/> : null}
													</div>
													)
												})
											}
											</>	
									)
									)
								}
								</td>
											
												<td>{
													i.products.map(data=>{
														return(
															<>
														 <p style={{ verticalAlign:'middle'}}>{data.quantity}</p>
														 <br/>
														 </>
														 )
													})
												}</td>
												<td>{
													i.products.map(data=>{
														return(
														<>
														<p style={{ verticalAlign:'middle'}}>{Number(data.product.price)}</p>
														 <br/>
														 </>
														 )
													})
												}</td>
								
								<td>{i.amount}</td>
								</tr>
								)
										
						})
						:null
					}
						</tbody>
						<tfoot>
						<tr>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
						<TablePagination
						component="div"
						count={orders.length}
						col={6}
						rowsPerPageOptions={[5,10,20 , {label:"All",value:-1}]}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						style={{width:"max-content" , translate:"50% 0"}}
					  />
					  </td>
					  <td></td>
					  <td></td>
					  <td></td>
					  <td></td>
						</tr>
						</tfoot>
					</Table>
					</div>
					</div>
					</div>
					</Tab>
					<Tab
					eventKey="completed"
					title="Completed Orders"
					>
					<div>
					<div>
					<InputGroup>
					<Form.Control 
					placeholder="Search by invoice No."
					onChange={searchOrder}
					aria-label="Search invoices by invoice no." />
					<Button variant="outlined-primary" >
					<SearchSVGIcon style={{width:20}}/>
					</Button>
					</InputGroup>
					</div>
					<div style={table_base}>
					<div style={table_wrapper}>
					<Table className="hover" style={{tableLayout:"fixed" , width:"auto", minWidth:'100%'}}>
					
					<thead style={{background:"#000" , color:"#eee", height:'3rem'}}>
					
					<th style={{width:"10%"}}>Date</th>
					<th>Invoice No.</th>
					<th>Customer</th>
					<th>Status</th>
					<th>Item</th>
					<th>Options</th>
					<th>Qty.</th>
					<th>Rate (HK$)</th>
					<th>Amount (HK$)</th>
					</thead>
					<tbody>
					
					{
						(completedOrders && completedOrders.length)?
						(rowsPerPage > 0
							? completedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							: completedOrders
						  ).map((i,j)=>{
							let name = (Object.keys(i).includes('ordered_by') && i.ordered_by && i.ordered_by.pushname) ? i.ordered_by.pushname : "Customer";
							return(
							<tr onClickCapture={(e)=>showOrder(e)} data-key={j} key={j} style={{verticalAlign:'middle'}}>
							<td>{new Date(`${i.created_on}`).toLocaleString()}</td>
							<td>{i.invoice_number?i.invoice_number:`00${j}`}</td>
							<td>{name}</td>
							<td onClick={(e)=>showOrder(e)}> <Chip color={i.delivery_status==='order_placed'?'success':'primary'} label={i.delivery_status}/></td>
							<td>
							{
								i.products.map((data , index)=>{
									return(
										<div>
										<p style={{ margin: '1.2rem 0 0 0'}}><b>{(i.products.length > 1) ? `${index}.` : null}{' '}</b><b>{data.product.title}</b></p><br />
										</div>
										)
									})
								}
							</td>
							
							<td>
							{
								i.products.map( data =>
										
									(
										<>
										{
										data.properties.map(function(options){
											return (	
												<div>
													<p><b>Color</b> : {options.colors}</p>
													<p><b>Size</b> : {options.sizes}</p>
													<p><b>Variation</b> : {options.variations}</p>
													{data.properties.length > 1 ? <hr/> : null}
												</div>
												)
											})
										}
										</>	
								)
								)
							}
							</td>
										
											<td>{
												i.products.map(data=>{
													return(
														<>
													 <p style={{ verticalAlign:'middle'}}>{data.quantity}</p>
													 <br/>
													 </>
													 )
												})
											}</td>
											<td>{
												i.products.map(data=>{
													return(
													<>
													<p style={{ verticalAlign:'middle'}}>{Number(data.product.price)}</p>
													 <br/>
													 </>
													 )
												})
											}</td>
							
							<td>{i.amount}</td>
							</tr>
							)
									
					})
					:null
				}
					</tbody>
					<tfoot>
					<tr>
					<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
						<td>
						<TablePagination
						component="div"
						count={orders.length}
						col={6}
						rowsPerPageOptions={[5,10,20 , {label:"All",value:-1}]}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
						style={{width:"max-content" , translate:"50% 0"}}
					  />
					  </td>
					  <td></td>
					  <td></td>
					  <td></td>
					  <td></td>
					</tr>
					</tfoot>
					</Table>
					</div>
					</div>
					</div>
			
					</Tab>
					</Tabs>
				</div>
				}
		</Layout>
    )
}
										}
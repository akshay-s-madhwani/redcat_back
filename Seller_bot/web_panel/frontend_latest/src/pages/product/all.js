import React, { useState, useEffect, useCallback } from 'react';

import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import { EditSVGIcon, DeleteSVGIcon } from "@react-md/material-icons"

import Layout from '../../components/layout';
import { delete_products, get_products, upload_products } from '../../api_handlers/products_api';
import ProductTable from '../../components/ProductsTable';
import Notiflix, { Confirm } from 'notiflix';
import { navigate } from 'gatsby';
import { isBrowser } from '../../utils/isBrowser';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import '../../components/tabs.css'


const wrapper = {
	display: 'flex',
	height: 'calc(100vh)',
	background: '#fff'
}
const page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start',paddingLeft:'1.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }
const collapsed_page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', overflowY: 'auto', width: '100vw', height: '100vh' }

const ActionIcons = { position: 'fixed', top: 75, right: 20, display: 'flex', justifyContent: 'space-between', padding: '1rem' }

export default function Upload() {
	if(typeof window !== 'undefined'){
		const collapsed_state = localStorage.getItem('collapsed');
	const [rendered , setRendered] = useState(true)
	const [products, setProducts] = useState([]);
	const [editableArea, setEditableArea] = useState(false);
	const [editingInto, setEditingInto] = useState(null);
	const [checked, setChecked] = useState(false)

	const [show , setShow] = useState(false);
	const [slider , setSlider] = useState(false);
	
	const [editable, setEditable] = useState([]);
	const [tab, setTabs] = useState('all')
	const [loading, setLoading] = useState(false);
	const [collapsed , setCollapsed] = useState(collapsed_state === 'true'?true:false);
	

	useEffect(() => {
		setRendered(true)
		if (tab === 'all') {
			setLoading(true);
			let store_ = JSON.parse(localStorage.getItem('store_'));
			if(!store_ || store_ === 'undefined'){
				console.log('store_')
				return setRendered(false);
			}
			let {seller_id} = JSON.parse(localStorage.getItem('store_'));
			if(!seller_id || seller_id === 'undefined'){
				console.log('seller_id')
				return setRendered(false);
			}
			
			get_products(seller_id)
				.then(i => {
					console.log(i)
					setLoading(false);
					if (i) {
						setRendered(true)
						console.log(rendered)
						// i.forEach(j=>Object.values(j.properties[0]).forEach(k=>k?k=k.join(' , '):null))
						setProducts(i);
						console.log(i);
					}
					if(!i || !Object.keys(i).length){
						console.log('object keys')
						setRendered(false)
					}
				})
				.catch(e => {
					console.log(e)
				})
		} else {
			setProducts([]);
		}
	}, [])


	useEffect(() => {
		console.log(products)
	}, [products])


	const deleteData = (e) => {
		Confirm.show(
			'Are you Sure',
			'Confirm to delete<br/><sub>p.s. It cannot be undone</sub>',
			'Delete',
			'Cancel',
			() => {
				if (editable.length) {
					
					editable.map((i, j) => {	 							
							
								let product_index = products.filter((f,index)=>{if(f._id===i){return f._id}})[0]
								console.log(product_index)
								delete_products(product_index._id)
								.then(i=>{})
								.catch(e=>console.log(e));
							console.log(i);
							let new_products = products.filter(d => d._id !== i)
							setProducts([...new_products]);
							setEditable([]);
							e.target.value = 'false'
							return i
					});
					setLoading(true);
					setTimeout(()=>location.reload(),2500)
					
				}
			}, () => { }
			,
			{ plainText: false }
		)
		setProducts(i => {
			let oldList = i;
			console.log(oldList)

			return [...oldList]
		})
		
	}

	useEffect(()=>{
		console.log(editable)
	},[editable])
	// const editData = (e) => {
	// 	setEditableArea(true);
	// }

	
	// {
		// 	editingInto ?
		// 		<div><Button variant="secondary" onCLick={() => products.length >= editingInto ? setEditableArea(true) : null}><EditSVGIcon style={{ width: 22, fill: '#fff' }} /> Edit</Button></div>
		// 		: null
		// }
	return (
		<Layout selected={'products'}>


			
				{
					rendered ?
				
			null
		:
		<div style={{width: '100%',height:'100%',pointerEvents:'none',position:'absolute' ,display:'grid',placeItems:'center'}}>
		<p>No Products Found</p>
		</div>}
	{
		loading?
		<div style={{width: '100%',height:'100%',pointerEvents:'none',position:'absolute' ,display:'grid',placeItems:'center'}}>
		<Spinner  variant="primary" animation="border"/>
		</div>
					:
				null }
			
				<div style={page_wrapper}>
					{checked ?
						<div style={ActionIcons}>
						
							<div onClick={(e) => {
								deleteData(e)
							}}><Button variant="danger" style={{ margin: '0 1.5rem' }}><DeleteSVGIcon style={{ width: 22, fill: '#fff' }} />Delete</Button></div>
						</div>
						: null
					}
					<h3 style={{ marginTop: "2rem" }}>Manage Products</h3>
					<p>Convenient and simple way to Edit or Add new Products to the Inventory</p>
					
					<Tab.Container
						defaultActiveKey="all"
						onSelect={(k) => setTabs(k)}
						>
				
						<Nav variant="tabs" className="flex-column">
						<Row style={{marginBottom:'-22px'}}>
						<Col sm={2}>
						<Nav.Item>
						<Nav.Link 
						eventKey="all"
						title="All Items"
						bsPrefix='nav-link'>All Products</Nav.Link>

						</Nav.Item>
						</Col>
						<Col sm={2}>
						<Nav.Item>
						<Nav.Link href="/product/upload/" eventKey="upload" bsPrefix='nav-link'>Add Items</Nav.Link>
						</Nav.Item>
						</Col>
						</Row>
						</Nav>
					
					
				
						<Tab.Content>
						<Tab.Pane eventKey="all">
							<ProductTable products={products} setProducts={setProducts} editable={editable} setEditable={setEditable} checked={checked} setChecked={setChecked} setEditingInto={setEditingInto} />
						</Tab.Pane>
						<Tab.Pane eventKey="first">
						</Tab.Pane>
						</Tab.Content>
					
						</Tab.Container>
				</div>
		</Layout>
	)
}else{return null}
}
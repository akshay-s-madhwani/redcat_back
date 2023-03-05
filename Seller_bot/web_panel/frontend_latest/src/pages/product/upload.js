import React, { useState, useEffect, useCallback } from 'react';

import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Spinner from 'react-bootstrap/Spinner';
import { EditSVGIcon, DeleteSVGIcon } from "@react-md/material-icons"
import { Report } from 'notiflix/build/notiflix-report-aio';

import Layout from '../../components/layout';
import download_btn from '../../images/download.svg';
import CSVReader from '../../components/CsvFileReader';
import ImageDropZone from '../../components/ImageDropZone';
import { delete_products, get_products, upload_products } from '../../api_handlers/products_api';
import UploadTable from '../../components/uploadTable';
import '../../components/tabs.css'
import Notiflix, { Confirm } from 'notiflix';
import { isBrowser } from '../../utils/isBrowser';
import { navigate } from 'gatsby';
import '../../components/style/upload.css'

export default function Upload() {
	if(typeof window !== 'undefined'){
	
	function symmetricDifference(setA, setB) {
		const _difference = new Set(setA);
		for (const elem of setB) {
			if (_difference.has(elem)) {
				_difference.delete(elem);
			} else {
				_difference.add(elem);
			}
		}
		return _difference;
	}
	const collapsed_state = localStorage.getItem('collapsed');
	const [rendered , setRendered] = useState(true)
	const [products, setProducts] = useState([]);
	const [rawData, setRawData] = useState([]);
	const [images, setImages] = useState([])
	const [category, setCategory] = useState('men_clothing');
	const [waiting, setWaiting] = useState('file');
	const [floatState, setFloatState] = useState(false);
	const [editableArea, setEditableArea] = useState(false);
	const [editingInto, setEditingInto] = useState(null);
	const [checked, setChecked] = useState(false)
	const [error, setError] = useState([])
	const [editable, setEditable] = useState([]);
	const [tab, setTabs] = useState('all')
	const [loading, setLoading] = useState(false);
	const [collapsed , setCollapsed] = useState(collapsed_state === 'true'?true:false);
	let required_headers = ['title', 'image', 'price', 'originalprice', 'stock', 'description', 'colors', 'sizes', 'variations'];

	
	const check_data = () => {
		let duplicate_name = [];
		let incorrect_number = [];
		let no_image = [];
		
		let original_names = [];
		products.forEach((i, j) => {
			if (typeof original_names === 'object') {
				if (!original_names.includes(i.title)) {
					original_names.push(i.title)
				} else {
					duplicate_name.push({ name: i.title, index: j })
				}
			}
			if(!i.description){
				i.description = 'No further description found'
			}
			if(!i.originalPrice || (typeof i.originalPrice === 'string' && !i.originalPrice.length)){
				i.originalPrice = i.price
			}
			if (isNaN(Number(i.price))) {
				incorrect_number.push({ type: 'Price', value: i.price, index: j })
			}
			
			if (isNaN(Number(i.stock))) {
				incorrect_number.push({ type: 'Stock', value: i.stock, index: j })
			}

			if (!i.hasImage) {
				no_image.push({ index: j, name: i.image })
			}
		});

		return { duplicate_name, incorrect_number, no_image }
	}


	const save_data = async () => {
		let { duplicate_name, incorrect_number, no_image } = check_data();
		let errors = '';
		let extra_image_error, extra_name_error, extra_number_error;
		console.log(duplicate_name, incorrect_number, no_image)
		if (duplicate_name.length) {
			errors += `Duplicate product names Not Allowed<br/>`
			if (duplicate_name.length > 2) {
				extra_name_error += `Duplicate product names Not Allowed\n`
				duplicate_name.forEach(i => extra_name_error += `@${i.index} , name: ${i.name}\n`)
			} else {
				duplicate_name.forEach(i => errors += `@${i.index} , name: ${i.name}<br/>`)
				errors += '<hr/>'
			}
		}
		
		if (incorrect_number.length) {
			if (incorrect_number.length > 5) {
				incorrect_number.forEach(i => extra_number_error += `${i.type} Should be an Integer<br/>@${i.index} , ${i.type}: ${i.value}\n`)
			} else {
				await incorrect_number.forEach(i => errors += `${i.type} Should be an Integer<br/>@${i.index} , ${i.type}: ${i.value}<br/>`)
				errors += '<hr/>'
			}
		}
		if (no_image.length) {
			errors += `Images are Mandatory<br/>(found image absent in ${no_image.reduce((i, j, k) => k += 1)} items)<br/>`
			if (no_image.length > 2) {
				extra_image_error += `Images are Mandatory<br/>(found image absent in ${no_image.reduce((i, j, k) => k += 1)} items)\n`
				no_image.forEach(i => extra_image_error += `@${i.index} , image name:${i.name.slice(0, 130)}\n`)
			} else {
				no_image.forEach(i => errors += `@${i.index} , image name:${i.name.slice(0, 30)}<br/>`)
				errors += '<hr/>'
			}
		}


		if (errors && (duplicate_name.length || no_image.length || incorrect_number.length)) {
			let error_message = `<b>${errors}</b><hr/>`
			error_message += extra_image_error ?
				`<a style='${error_download_file}' href="${window.URL.createObjectURL(new Blob([extra_image_error], { type: 'plain/text' }))}" download='redcat_image_errors.txt'>Image Error File <img style="width:16px;margin-top:-7px;margin-right:7px" src="${download_btn}"/></a><br/>` : ``;
			error_message += extra_name_error ? `<a style='${error_download_file}' href='${window.URL.createObjectURL(new Blob([extra_name_error], { type: 'plain/text' }))}' download='redcat_name_errors.txt'>Names Error File <img style="width:16px;margin-top:-7px;margin-right:7px" src=${download_btn}/></a><br/>` : '';
			error_message += extra_number_error ? `<a style='${error_download_file}' href='${window.URL.createObjectURL(new Blob([extra_number_error], { type: 'plain/text' }))}' download='redcat_data_errors.txt'>Integrity Error File <img style="width:16px;margin-top:-7px;margin-right:7px" src=${download_btn}/></a><br/>` : ``;
			return Report.warning(
				'Found Errors',
				error_message,
				'Ok',
				{
					backOverlayColor: '#333a',
					messageFontSize: 16,
					messageFontWeight: 700,
					plainText: false,
					messageMaxLength: 12200
				}
			)
		}
		if (!errors) {
			for (let i of products) {
				i.price = Number(i.price);
				i.stock = Number(i.stock);
				i.originalPrice = Number(i.originalprice);
				i.imageData = i.image;
				i.hasImage = true;
				i.seller_data = JSON.parse(localStorage.getItem('store_')).seller_id;
				i.number = JSON.parse(localStorage.getItem('store_')).number;
				try {
					i['properties'] = [{ colors: i.colors, sizes: i.sizes, variations: i.variations }];
					console.log(i)
					let response = await upload_products({ ...i });
					console.log(response)

					if (response.success) {
						setWaiting('file');
						setProducts([]);
						navigate('/product/all')
					} else {
						setError(i => [...i, { name: i.name, message: response.message }])
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}
	useEffect(() => {
		if (error.length) {
			
			let msg = ''
			for (let i of error) {
				if(i.name && i.message){
				msg += `In Item : ${i.name} , Error : ${i.message}\n`
			}
			}
			if(msg.length){
			Report.failure(
				`${error.length === 1 ? 'Error' : 'Errors'} Found in Adding data`,
				msg,
				'Ok'
			);
		}
			() => setError([]);
		}
	}, [error])


	useEffect(() => {
		for (let i of images) {
			console.log(images);
			let updated_products = products.map(j => {
				console.log(i, j)
				if (j.image.replace('.jpg', '').replace('.jpeg', '').replace('.png', '') === i.name.replace('.jpg', '').replace('.jpeg', '').replace('.png', '')) {
					j.hasImage = true;
					j.imageFileName = j.image;
					j.imageData = i.data
					j.image = i.data;
				}
			});

			setProducts(data => [...products])
		}
	}, [images])

	useEffect(() => {
		console.log(products)
	}, [products])

	useEffect(() => {
		setLoading(true);
		console.log(rawData)
		if (rawData.length) {
			let header = rawData[0];
			header = header.map(i => i.toLowerCase());
			let header_difference = symmetricDifference(new Set(required_headers), new Set(header));

			if (header_difference.size > 0) {
				setWaiting('file');
				setLoading(false)
				return Report.warning(`<b>Issues in Headers found</b>`,
					`These Headers do not match Or , are not needed:<br/>${Array.from(header_difference).join(' , ')}`, 'Ok');

			} else {
				let seggregatedData = [];
				let pos = {};
				let rows = rawData.slice(1,)

				for (let i in header) {
					pos[header[i]] = i
				}

				for (let r of rows) {
					if (!r.length || !r[0]) {
						continue;
					}
					let data = {}
					for (let headers of header) {
						if (r[pos[headers]]) {
							data[headers] = r[pos[headers]]
						}
					}
					data['hasImage'] = false;
					data['category'] = category;
					data['product_id'] = Math.random()*10000;
					seggregatedData.push(data);
				}
				if (seggregatedData.length) {
					setProducts((i) => {
						console.log(i)
					})
					setWaiting('images');
					setLoading(false)
					setProducts(seggregatedData);
				}
				console.log(seggregatedData)

			}
		}
	}, [rawData]
	);

	const deleteData = (e) => {
		Confirm.show(
			'Are you Sure',
			'Confirm to delete<br/><sub>p.s. It cannot be undone</sub>',
			'Delete',
			'Cancel',
			() => {
				if (editable.length) {
					
					editable.map(async (i, j) => {
						if (tab !== 'all') {
							setProducts(data => {
								let new_data = data.filter(d=> d.product_id !== Number(i))
								console.log(new_data)
								return [...new_data]
							})
							setEditable([]);
							console.log(editable)
							console.log(products)
						} else {
							console.log(tab, products[j])
							try {
								let product_index = products.filter((f,index)=>{if(f.product_id===Number(i)){return index}})
								await delete_products(products[product_index]._id);
							} catch (e) {
								console.log(e);
							}
							console.log(i);
							let new_products = products.filter(d => d.product_id !== Number(i))
							setProducts([...new_products]);
							setEditable([]);
							e.target.value = 'false'
							return i
						}
					})
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

	// const editData = (e) => {
	// 	setEditableArea(true);
	// }

	
	// {
		// 	editingInto ?
		// 		<div><Button variant="secondary" onCLick={() => products.length >= editingInto ? setEditableArea(true) : null}><EditSVGIcon className='{ width: 22, fill: '#fff' }} /> Edit</Button></div>
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
			
				<div className='page_wrapper'>
					{checked ?
						<div className='ActionIcons'>
						
							<div onClick={(e) => deleteData(e)}><Button variant="danger" style={{ margin: '0 1.5rem' }}><DeleteSVGIcon style={{ width: 22, fill: '#fff' }} />Delete</Button></div>
						</div>
						: null
					}
					<h3 style={{ marginTop: "2rem" }}>Manage Products</h3>
					<p>Convenient and simple way to Edit or Add new Products to the Inventory</p>
				
					<Tab.Container
						defaultActiveKey="upload"
						onSelect={(k) => setTabs(k)}
						>
				
						<Nav variant="tabs" className="flex-column">
						<Row style={{marginBottom:'-22px'}}>
						<Col sm={2}>
						<Nav.Item>
						<Nav.Link
                        href="/product/all/" 
						eventKey="all"
						title="All Items" 
						bsPrefix='nav-link'>All Products</Nav.Link>
						
						</Nav.Item>
						</Col>
						<Col sm={2}>
						<Nav.Item>
						<Nav.Link eventKey="upload" bsPrefix='nav-link'>Add Items</Nav.Link>
						</Nav.Item>
						</Col>
						</Row>
						</Nav>
					
					
				
						<Tab.Content>
						<Tab.Pane eventKey="all">
                        </Tab.Pane>
                        <Tab.Pane eventKey="upload">
							{
								(waiting === 'file') ?
									<Button variant="primary" onClick={() => { setFloatState(true) }} style={{ margin: '0 1rem' }} className="downloadButton">Add New Products</Button>
									:
									(waiting === 'images') ?
										<>
											<Button variant="primary" onClick={() => { setFloatState(true); }} style={{ margin: '0 1rem' }} className="downloadButton">Upload Images {
												products.length ? products.filter(i => !i.hasImage).length : null
											}</Button>
											<Button variant="primary" onClick={() => save_data()} style={{ margin: '0 1rem' }} className="downloadButton">Save products </Button>
											<Button variant="primary" onClick={() => { setWaiting('file'); setProducts([]) }} style={{ margin: '0 1rem' }} className="downloadButton">Go Back </Button>
										</>
										:
										null
							}
							{
								(floatState) ?
									<div className="FloatWindow">
										<div className="dropContainer">
											<CloseButton onClick={() => setFloatState(false)} className="close_button" />
											{
												(waiting === 'file') ?
													<Form.Select size={'md'} onChange={(e) => setCategory(e.target.value)}>
														<option value="men_clothing">Men Clothing</option>
														<option value="women_clothing">Women Clothing</option>
														<option value="electronics">Electronics</option>
														<option value="jewellery">Jewellery</option>
														<option value="accessories">Fashion Accessories</option>
													</Form.Select>
													: null
											}
											{
												(waiting === 'file') ?


													<CSVReader setRawData={setRawData} setWaiting={setWaiting} setFloat={setFloatState} />

													:
													<ImageDropZone waiting={waiting} setWaiting={waiting} setImages={setImages} setFloat={setFloatState} />
											}
											{
												(waiting === 'file') ?
												<>
													<Button as="a" download href="../../static/products_upload_format.csv" variant="outlined-light" className="downloadButton">Download format<img src={download_btn} className="download_icon" /></Button>
													<footer style={{    padding: '0.3rem 1rem',
														background: '#333d',
														color: '#fff',
														marginTop: '0.5rem',
														borderRadius: 10}}>
    <h6>Note:</h6>
    <ul>
        <li>Mandatory fields : Title , Price , Image , Description</li>
<li>For Image: Only Filename of image to be uploaded, is required E.g. white_shoe.jpg =&gt; white_shoe</li>
<li>Duplicate titles are not allowed
</li>
</ul>
</footer>
													</>
													:
													null
											}

										</div>
									</div>
									:
									null
							}
							
								
							<UploadTable products={products} setProducts={setProducts} editable={editable} setEditable={setEditable} checked={checked} setChecked={setChecked} tab="upload" setEditingInto={setEditingInto} />
								
							
                            </Tab.Pane>
                            </Tab.Content>
                            </Tab.Container>
						
						
				</div>
		</Layout>
	)
}
}
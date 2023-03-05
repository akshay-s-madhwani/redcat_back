import React , { useState , useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { RiEyeCloseFill } from '@react-icons/all-files/ri/RiEyeCloseFill'
import { MdArrowBack } from '@react-icons/all-files/md/MdArrowBack';

import Navbar from '../components/Navbar';
import Layout from '../components/layout';
import countryCodes from '../utils/countryCodes.json';
import logo from '../images/red cat logo_default.png';
import { navigate } from 'gatsby'

import { register_user , check_mail , check_name , check_number } from '../api_handlers/account_api';
import { isBrowser } from '../utils/isBrowser';
import { InfoOutlineFontIcon } from '@react-md/material-icons';


const signupLayout = {
    display: 'flex',
    flexFlow: 'column',
	overflow:'hidden'
}
const formLayout = {
    margin: '3rem',
	maxWidth: '90vw'
}

const pageLayout = {
	display:'flex',
	justifyContent:'stretch'
};

const introLayout = {
	
	display:'flex',
	flexFlow:'column',
	alignItems:'center',
	justifyContent:'center'
}

const introLines = {
	display:'flex',
	alignItems:'center',
	margin:'1rem 0',
	fontWeight:700,
	fontFamily:"'Poppins' , sans-serif",
	maxWidth:'92vw'
}

const introLogo = {
	width:'7rem',
	marginLeft:'-1rem'
}

const lineBadge = {
	borderRadius:'50%',
	padding:'2px 10px',
	color:'#fff',
	background:'#4f5df9',
	minWidth:20,
	textAlign:'center'
}


const fillLine = {
	borderTop:'1px solid #999',
	width:'1.5rem',
	height:0,
}

const reset = {
	padding:0,
	margin:0
}

const backButton = {
	width: '2rem',
    height: '2rem',
    background: '#eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    boxShadow: '0 0 5px #999'
}

const form_error = {color:'red',fontSize:14,marginLeft:12};
export default function Signup() {
	if(typeof window !== 'undefined'){
const [name , setName] = useState('');
const [email , setEmail] = useState('');
const [number , setNumber] = useState('');
const [areaCode , setAreaCode] = useState('852');
const [password , setPassword] = useState('');
const [currency , setCurrency] = useState('hkd')
const [house , setHouse] = useState('');
const [building , setBuilding] = useState('');
const [street , setStreet] = useState('');
const [city , setCity] = useState('');
const [postal, setPostal] = useState('');

const [page , setPage] = useState(0);
const [loader ,setLoader] = useState(false);
const [passwordToggle , setPasswordToggle] = useState(false);
const [validated , setValidated] = useState();
const [error , setError] = useState(
{
	name:"",
	number:"",
	email:""
}
	)

const [ store_ , setStore_ ] = useState();
const [ csrfToken , setCsrfToken] = useState();

useEffect(()=>{
	if(store_ && typeof store_ === 'object' && Object.keys(store_).includes('seller_id'))
	localStorage.setItem('store_',JSON.stringify({...store_}));
}, [store_]);

useEffect(()=>{
	if(csrfToken !== 'undefined' && csrfToken){
	localStorage.setItem('csrf_token',csrfToken);
	navigate('/verify');
}
}, [csrfToken]);

const stabilise_form = (e)=>{
	e.preventDefault();
	e.stopPropagation()
}

const change_page = async()=>{
	if(page === 0){
		let empty_field_errors={email:'',number:'',name:''}
		setLoader(true)
		if(!email){
			empty_field_errors.email = "Email is necessary"
		}
		if(String(email)
		.toLowerCase()
		.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
			empty_field_errors.email = "Incorrect format , Please enter a valid email addres"
		}
		if(!number){
			empty_field_errors.number = "Number is necessary"
		}
		if(isNaN(number)){
			empty_field_errors.number = "Should be Numbers only"
		}
		if(String(number).length < 6){
			empty_field_errors.number = "Not a valid Whatsapp Number"
		}
		if(!name){
			empty_field_errors.name = "Shop name is necessary"
		}
		
		setError(empty_field_errors)
		if( !email || !number || !name || (String(number).length < 6) || isNaN(number) ){
			return
		}
		
		
		let validators = await Promise.all([check_mail(email),check_number(Number(areaCode.replace('+','')+number)), check_name(name)]);
		console.log(validators)
		if(validators[0].msg !== 'success'){
			console.log(validators[0]);
			setLoader(false);
			setValidated(false)
			return setError({name:error.name,email:validators[0].msg,number:error.number})
		}
	if(validators[1].msg !== 'success' ){
		console.log(validators[1])
		setValidated(false)
			return setError({name:error.name,email:error.email,number:validators[1].msg})
		}
	if(validators[1].numberExists === 'false'){
		setValidated(false)
		
		return setError({name:error.name,email:error.email,number:`Not a valid Whatsapp number
Checked as ${areaCode.replace('+','')}-${number}`})
	}

	if(validators[2].msg !== 'success'){
		console.log(validators[2])
		setValidated(false)
			return setError({number:error.number,email:error.email,name:validators[2].msg})
	}
		setValidated(true);
		return setPage(1)
	}
	
		let response = await register_user({
			shop_name:name , password, email , number:String(areaCode+number).replace('+','') , house, building , street , city , currency , postal 
		});
		console.log(response);
		if(response){
			setStore_({shop_name:name , number : response.number , email,  currency , seller_id:response.seller_id});
			setCsrfToken(response.token);
		}

}

// useEffect(()=>{
// 	console.log(error)
	// setLoader(false);
// },[validated])

    return (
    
    <div style={signupLayout}>
		<Navbar button_text='Login'
			button_action={()=>{
			navigate('/login')}
			}
		  />
		<Row style={pageLayout} >
		<Col style={introLayout} lg={6} md={5} sm={12} className="m-4">
		<div>
		<img src={logo} style={introLogo} />
		<div style={{display:'flex' , justifyContent:'space-between' , flexFlow:'column'}}>
		<div style={introLines}>
		<span style={lineBadge}>1</span><div style={fillLine}></div><p style={reset}>A Complete Whatsapp based retail system</p>
		</div>
		<div style={introLines}>
		<span style={lineBadge}>2</span><div style={fillLine}></div><p style={reset}>Manage Orders Directly from Whatsapp</p>
		</div>
		<div style={introLines}>
		<span style={lineBadge}>3</span><div style={fillLine}></div><p style={reset}>Increase Revenues from Greater network of Consumers</p>
		</div>

		</div>
		</div>
		</Col>
		<Col style={formLayout} lg={4} md={5} sm={10} className="m-4" >
	{
	(page === 0)?
	<>
	<Form noValidate onSubmit={()=>stabilise_form} validated={validated} onKeyDown={(e)=>e.key === 'Enter'?change_page():null} controlId="formGroup" className="mb-3">
	<h2>Sign Up</h2>
	

	<h4> Create your Merchant account with us</h4>
	
	<FloatingLabel
	controlId="email"
	label="Email"
	className="mb-3">
	
	
	<Form.Control type="email"  name="Email" onChange={(e)=>setEmail(e.target.value)} placeholder="Please enter your email"/>
	<p style={form_error}>
	{error.email}
	</p>
	</FloatingLabel>
	
	<Row>
	<Col>
	<InputGroup>
	<InputGroup.Text id="basic-addon1">+</InputGroup.Text>
	<Form.Select size="sm" placeholder="Country code" style={{height:"3.5rem"}} aria-label="Default select example" aria-aria-describedby='basic-addon1'  onChange={(e)=>setAreaCode(e.target.value.replace('+',''))}>
	
      <option default value="852" data-country="Hong Kong">852 HK</option> 
	  {
		countryCodes.map(data=>
			<option value={`${data.code}`} data-country={data.country} >{data.code} {data.country.slice(0,7)}</option>
		)
	  }
	</Form.Select>
    </InputGroup>
    </Col>
    <Col xs={7}>
	<FloatingLabel
	controlId="number"
	label="Whatsapp No."
	className="mb-4">
	
	<Form.Control  name="number" onChange={(e)=>setNumber(e.target.value)}  placeholder="Please enter your Whatsapp Number"/>
	<p style={form_error}>
	{error.number}
	</p>
	</FloatingLabel>
	
	</Col>
	</Row>
	<Form.Group as={Row}>
	<FloatingLabel
	controlId="shopname"
	label="&nbsp;&nbsp;Your Business or Shop's name"
	className="mb-3"

	>
	
	<Form.Control type="text"  name="shopname" onChange={(e)=>setName(e.target.value)} placeholder="&nbsp;Your Business / Shop name"/>
	<p style={form_error}>
	{error.name}
	</p>
	</FloatingLabel>
	
	</Form.Group>
	<InputGroup>
	<FloatingLabel
	controlId="password"
	label="New Password"
	className="mb-3">
	
	<Form.Control type={passwordToggle?"text":"password"}  name="password" aria-aria-describedby='basic-addon2' onChange={(e)=>setPassword(e.target.value)} placeholder="Please enter new password"/>
	</FloatingLabel>
	<InputGroup.Text id="basic-addon2" style={{maxHeight:'calc(3.5rem + 2px)'}} onClick={()=>setPasswordToggle(!passwordToggle)}>
	{
		passwordToggle?
		
		<BsEyeFill />
		:
		<RiEyeCloseFill />
	}
	</InputGroup.Text>
	</InputGroup>
	</Form>
	<div className="d-grid">
	<Button size="md" onClick={()=>change_page()}>Continue {loader ? <Spinner variant="white" animation="border" style={{marginLeft:10,width:'1rem',height:'1rem',border:'2px white solid',borderLeft:'transparent',borderRight:'transparent'}}/>:null}</Button>
	</div>
	</>
 :
<>
<Form.Group controlId="formGroup" className="mb-3">
	
	<div style={backButton}>
	{
		(page === 1)?
		<MdArrowBack onClick={(e)=>{
			e.preventDefault();
			setPage(0);
		}}/>
		:
		null
	}
	</div>
	<h3>Provide us Details of your Business</h3>
	<br/>
	<FloatingLabel
	controlId="house"
	label="House / Shop No."
	className="mb-3">
	
	<Form.Control type="text"  name="house" onChange={(e)=>setHouse(e.target.value)} placeholder="Please enter Address Line of your shop"/>
	</FloatingLabel>
		<FloatingLabel
	controlId="building"
	label="Building name"
	className="mb-3">
	
	<Form.Control type="text"  name="building" onChange={(e)=>setBuilding(e.target.value)} placeholder="Please enter your Building's name"/>
	</FloatingLabel>
		<FloatingLabel
	controlId="street"
	label="Street Name"
	className="mb-3">
	
	<Form.Control type="text"  name="street" onChange={(e)=>setStreet(e.target.value)} placeholder="Please enter street name"/>
	</FloatingLabel>
<Row>	
<Col>
		<FloatingLabel
	controlId="city"
	label="City"
	className="mb-3">
	
	<Form.Control type="text"  name="city" onChange={(e)=>setCity(e.target.value)} placeholder="Please enter city"/>
	</FloatingLabel>
</Col>
<Col>
		<FloatingLabel
	controlId="postal"
	label="Postal Code"
	className="mb-3">
	
	<Form.Control type="number"  name="postal" onChange={(e)=>setPostal(e.target.value)} placeholder="Please enter your postal code"/>
	</FloatingLabel>
	</Col>
	</Row>
	</Form.Group>
	<div className="d-grid">
	<Button size="md" type="submit" onClick={()=>{change_page()}}>Submit</Button>
	</div>
</>
}
	
	<div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
	
      <Badge pill bg={`${page===0?'primary':'success'}`} style = {{transition:'1s ease-out',fontSize:'.9rem'}} className="m-4">
			1
      </Badge>{''}
      <Badge pill bg={`${page===0?'secondary':'primary'}`} style={{fontSize:'.93rem'}} className='m-2'>
			2
      </Badge>{''}
	</div>
 	</Col>
	</Row>
	</div>
    )
}else{return null}
}
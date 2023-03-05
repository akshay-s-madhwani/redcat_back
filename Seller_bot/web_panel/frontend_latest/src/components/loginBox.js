import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import { BsEyeFill } from '@react-icons/all-files/bs/BsEyeFill';
import { RiEyeCloseFill } from '@react-icons/all-files/ri/RiEyeCloseFill'
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import {login_user} from '../api_handlers/account_api'
import { navigate } from 'gatsby';

const container = {
	width:'60%',
	minWidth:'300px',
	maxWidth:'550px',
	height:'350px',
	padding:'30px',
	display:'flex',
	flexFlow:'column',
	justifyContent:'space-evenly',
	borderRadius:'12px',
	boxShadow:'#4f49 0px 1px 16px 1px',
}


const formHeader = {
	margin:3
}

const form_error = {color:'red',fontSize:14,marginLeft:12}
export default function LoginBox(){
	const [ number , setNumber ]= useState('');
	const [ password , setPassword ]= useState('');

	const [error_user , setError_user] = useState('')
	const [error_pass , setError_pass] = useState('')
	const [error_err , setError_err] = useState('')
	const [loader , setLoader] = useState(false)
	const [passwordToggle , setPasswordToggle] = useState(false);

	const [ store_ , setStore_ ] = useState();
	const [ csrfToken , setCsrfToken ] = useState();

	useEffect(()=>{
		if(store_){
			localStorage.setItem('store_',JSON.stringify({...store_}))
		}
	},[store_]);
	useEffect(()=>{
		if(csrfToken){
		localStorage.setItem('CSRF_token',csrfToken);navigate('/product/all');
}},[csrfToken])
	
	const submit_login = async ({number , password})=>{
		setError_user('')
	setError_pass('')
		setError_err('')
		setLoader(true)
		let response = await login_user({number , password});
		console.log(response)
		if(response.success !== true){
			setLoader(false)
			if(response.type === 'user'){
			return setError_user(response.msg)
		}
		if(response.type === 'password'){
			return setError_pass(response.msg)
		}
		if(response.type === 'error'){
			return setError_err('Couldn\'t connect to server')
		}
		
		}else{
		
			setCsrfToken(response.token);
			let { seller_id , name , email , number , currency} = response;
			let store = {seller_id , shop_name:name , email , number , currency }
			setStore_(store)
			
		}
	}

	return (
	<div style={container} onKeyDown={e=>{if(e.keyCode===13){submit_login({number , password})}else{console.log(e.keyCode)}}}>
		<h3 style={formHeader}>
			Login
		</h3>
		<InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1" style={{maxHeight:'3.6rem'}}>+</InputGroup.Text>
		<FloatingLabel
        controlId="floatingInput"
        label="Whatsapp Number"
        className="mb-3">
		
        <Form.Control type="tel" onChange={(e)=>setNumber(e.target.value)} placeholder="Area Code & Phone number" />
		<p class="form-error" style={form_error}>{error_user}</p>
      </FloatingLabel>
</InputGroup>
<InputGroup>
      <FloatingLabel controlId="floatingPassword" label="Password">
	  <Form.Control type={passwordToggle?"text":"password"}  name="password" aria-aria-describedby='basic-addon2' onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />
		<p class="form-error" style={form_error}>{error_pass}</p>
		<p class="form-error" style={form_error}>{error_err}</p>
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
		<Button variant='primary' onClick={()=>submit_login({number , password})} >Login &nbsp;{loader ? <Spinner variant="white" animation="border" style={{marginLeft:10,width:'1rem',height:'1rem',border:'2px white solid',borderLeft:'transparent',borderRight:'transparent'}}/>:null}</Button>		
	</div>
	)
}
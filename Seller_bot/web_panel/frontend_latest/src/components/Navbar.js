import React, { useEffect, useState } from 'react';
import logo from '../images/red cat logo-ai_whitex256.png';
import Button from 'react-bootstrap/Button';
import { navigate } from 'gatsby'
import { verify } from '../api_handlers/account_api';
import { isBrowser } from '../utils/isBrowser';

const headerStyles = {
  height: 65,
    color: 'rgb(238, 238, 238)',
    display: 'grid',
    gridTemplateColumns: '1fr 6fr 1fr',
    padding: '0.6rem',
    placeItems:'center',
    background: 'rgba(0,103,86,255)',
    boxShadow: '0 8px 32px 0 rgba(0,103,86,255)',
    backdropFilter: 'blur( 16.5px )',
  fontFamily:'sans-serif',
  fontWeight:'700'
}

const logoContainer = {
	display:'flex',
	alignItems:"flex-end",
}

const logo_ = {
	width:'5rem',
	marginTop:'-0.5rem',
  marginLeft:'1rem'
}
export default function Navbar({button_text , button_action}){
  if(!isBrowser){return}
	let [action , setAction]= useState({text:button_text,action:button_action})
useEffect(()=>{
  if(isBrowser){
  let token = localStorage.getItem('CSRF_token')
  if(token === 'undefined' || token === 'null' || !token){
    
    if(!location.href.includes('login') && !location.href.includes('signup')){
      navigate('/login')
    }
  }
  if(token){
    verify()
    .then(isMatch=>{
     
      if(isMatch.success){
        let store_ = JSON.parse(localStorage['store_']);
        store_.email = isMatch.email;
        store_.number = isMatch.number;
        localStorage.setItem('store_',JSON.stringify(store_));
        if(location.href.includes('login') || location.href.includes('signup')){
          navigate('/products/');
        }
      }
      else{
        if(location.pathname !== '/login/' && location.pathname !== '/signup/'){
          navigate('/login/')
        }
      }
    
    })
    .catch(e=>{
      console.log(e.data)
    })
}
  }

},[])
  console.log(action)
	return(
<header >
    <nav style={headerStyles}>
        <div style={logoContainer}>
        <img src={logo} style={logo_}/>
        
         </div>
         <div></div>
         <Button variant="outline-light" onClick={action.action}>{action.text}</Button>
         
    </nav>
    </header>
)}
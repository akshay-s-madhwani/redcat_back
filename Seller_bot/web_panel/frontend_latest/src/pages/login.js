import { navigate } from 'gatsby';
import React from 'react';
import LoginBox from '../components/loginBox';
import Navbar from '../components/Navbar';
import { isBrowser } from '../utils/isBrowser';


const pageStyles = {
	color: '#232129',
	padding: 96,
	fontFamily: '-apple-system, Roboto, sans-serif, serif',
}

const headerStyles = {
	height:65 , 
  background:'#2B221A',
	color:'#eee',
	display:'grid',
	gridTemplateColumns:'1fr 6fr 1fr',
	padding:'.6rem',
	justifyItems:'center',
	alignItems:'center',
	fontFamily:'sans-serif',
	fontWeight:'700'
}

const loginLayout = {
	display:'flex',
	justifyContent:'center',
	alignItems:'center',
	margin:'auto',
	padding:'7%',
}
const headingStyles = {
	marginTop: 0,
	marginBottom: 64,
	maxWidth: 320,
}
const headingAccentStyles = {
	color: '#663399',
}

export default function Login({children}){
	if(typeof window !== 'undefined'){
	return (
		<div>
			<Navbar button_text="Signup"  button_action={()=>{
				navigate('/signup/')
			}}/>
			<div style={loginLayout}>
				<LoginBox />
			</div>
		</div>
	)
	}else{
		return null
	}
	
}
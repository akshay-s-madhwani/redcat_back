import React , {useEffect, useLayoutEffect, useState} from 'react';
import { navigate } from 'gatsby';

import{ PersonSVGIcon } from '@react-md/material-icons';
import {  MdHome } from '@react-icons/all-files/md/MdHome';
import {  MdAccountBox } from '@react-icons/all-files/md/MdAccountBox';
import { RiPercentFill } from '@react-icons/all-files/ri/RiPercentFill';
import { HiArchive } from '@react-icons/all-files/hi/HiArchive';
import {  MdCheck } from '@react-icons/all-files/md/MdCheck';
import { GiHamburgerMenu} from '@react-icons/all-files/gi/GiHamburgerMenu';
import { MdStore } from '@react-icons/all-files/md/MdStore'
import  {BiLogOut}  from '@react-icons/all-files/bi/BiLogOut'
import logo from '../images/red cat logo-ai_whitex256.png';

import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import account from '../images/icons8-account-32.png';

import './sidebar_links_animation.css';
import './style/sidebar.css';
import { verify } from '../api_handlers/account_api';
import { isBrowser } from '../utils/isBrowser';


const logoContainer = {
	display:'flex',
	alignItems:"center",
	flexFlow:'column',
	height:'7rem',
	color:'#fff'
}

const logo_ = {
	width:'4.5rem',
	margin:'0',
	transform: 'translate(-14px, 11px)',
	zIndex:1
}
const linkWrapper = {
	display:'flex',
	flexFlow:'column',
	alignItems:'stretch',
	alignSelf:'flex-end',
	width:'10rem',
	padding:'1rem'
}
const collapsedLinkWrapper = {
	display:'flex',
	flexFlow:'column',
	alignItems:'center',
	alignSelf:'center',
	width:'10rem',
	padding:15,
	maxWidth:'100%'
}

const imageWraper = {
	display:'flex',
	justifyContent:'center',
	alignItems:'center',
	width:'7rem',
	height:'6rem'
}

const image = {
	padding:'1rem',
	border:'1px solid  rgb(42 38 42 / 81%)',
	borderRadius:'50%',
	width:'7rem',
	height:'7rem'
}
const accountWrapper = {
	display:'flex',
	flexFlow:'column',
	justifyContent:'space-between',
	margin:'1rem 12px'
}

const City = {
	color:'#eee',
	textAlign:'center',
	fontWeight:550,
	fontSize:'.85rem',
	marginBottom:0,
	marginTop:'1rem'
}

const link={
    textRendering: "optimizeLegibility",
    margin: '10px 0',
	cursor:'pointer'
};

const SelectedLink = {
	border:" 2px solid #fff",
    textRendering: "optimizeLegibility",
    borderRadius: 10,
    margin: '10px 0',
	
	width:'3rem',
	padding:'0 3px',
	background:'#eee',
    color:'#222'
}
const collapsed_selected_link = {
    textRendering: "optimizeLegibility",
    margin: '10px 0',
    borderLeft:'2px solid #eee',
    color:'#222'
}
const text = {
	color:'#eee',
	textAlign:'center',
	fontWeight:670
}
const link_p={
	...text,
	margin:"10px 0",
}
const link_black = {
	...link_p,
	color:'#222'
}

const logout_show = {
	transition:'.1s 1 ease-in 1'
}
const logout_hide={display:'none'}

// <OverlayTrigger
// 			placement="right"
// 			overlay={<Tooltip id="button-tooltip-2">Coupons</Tooltip>}
// 			>
			
// 			<div id="links" 
// 			style={selected=='coupons'?collapsed?collapsed_selected_link : SelectedLink:link} >
// 			<p style={selected=='coupons'?link_black:link_p} onClick={()=>navigate('/coupons')}><RiPercentFill style={{margin:'0 5px 3px 0'}}/>{collapsed?`Coupons`:''}</p>
// 			<div id="underline"></div>
// 			</div>
			
// 			</OverlayTrigger>

export function Sidebar({selected , collapsed , setCollapsed , show , setShow , slider , setSlider}){
	if(!isBrowser){return}
	const [selection , setSelection] = useState(selected);
	const [sellerData , setSellerData] = useState({name:'',email:'',profile_picture:''})
	let [action , setAction]= useState({text:'',action:function(){}});
	const [changer , setChanger] = useState([collapsed , setCollapsed])
	
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (screenWidth < 992) {
			setShow(true)
            setCollapsed(false);
			setSlider(true)
        } else {
			
            setCollapsed(localStorage.getItem('collapsed') == "true" ? false : true);
			setSlider(false)
        }
    }, [screenWidth]);

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

	const toggleSizeChange = ()=>{
		console.log(!changer[0])

	}


	useLayoutEffect(()=>{
		
		
	  setAction({text:'Login',action:()=>{
		localStorage.removeItem('CSRF_token');
		navigate('/login')}
	  })
	  let store_data = JSON.parse(localStorage.getItem('store_'))
	  if(store_data && typeof store_data === 'object' ){
	  setSellerData({...store_data});
	}
	},[])

	useEffect(()=>{
	if(isBrowser){
		let token = localStorage.getItem('CSRF_token')
  if(token === 'undefined' || token === 'null' || !token){
      navigate('/login')
  }
  if(token){
	  if(token){
		verify()
		.then(isMatch=>{
		if(isMatch){
		  if(isMatch.success){
			let store_ = JSON.parse(localStorage['store_']);
			// store_.email = isMatch.email;
			// store_.number = isMatch.number;
			// store_.name = ismatch.name;
			// store_.currency = isMatch.currency;
			localStorage.setItem('store_',JSON.stringify({...store_,...isMatch}));
			setAction(i=>{
			  return {
				text : 'Logout',
				action:()=>{
				localStorage.removeItem('CSRF_token');
				navigate('/login')}
			  } });
			if(window.location.href.includes('login') || window.location.href.includes('signup')){
			//   navigate('/products');
			console.log('navigating to products')
			}
		  }
		  else{
			navigate('/login')
		  }
		}
		  else{
			navigate('/login')
		  }
	
		})
		.catch(e=>{
		  console.log(e.data)
		})
	}

}}
	},[])	

	useEffect(()=>{
		localStorage.setItem('collapsed', `${!collapsed}` )
	},[collapsed])

	return (
	<div className={`sidebar ${collapsed ? '' : 'collapsed_sidebar'} ${show? 'slide_front' : 'slide_back'}`}>
	<div style={logoContainer}>
	<div style={{display:'flex',alignItems:'flex-end'}}>
	<div className="menu_button" style={{alignSelf:'center',padding:2,marginLeft:20,zIndex:2}}>
	<GiHamburgerMenu style={{width:'1.5rem',height:'1.5rem'}} onClick={()=>{
		slider ? setShow(!show) : setCollapsed(!collapsed);
	}}></GiHamburgerMenu>
	</div>
	<img src={logo} style={logo_}/>
	
	</div>

	
	 </div>
	 {collapsed ? 
		<div style={accountWrapper}>
		<div style={imageWraper}>
		<MdStore style={image}/>
		</div>
		
		<p style={City}>{sellerData.name}</p>
		</div>
		:null
	 }
		<div style={collapsed?linkWrapper:collapsedLinkWrapper}>
		<OverlayTrigger
		placement="right"
		overlay={<Tooltip id="button-tooltip-2">Dashboard</Tooltip>}
		>
		<div id="links" 
		style={selected=='home'? collapsed?collapsed_selected_link : SelectedLink:link} >
		<p style={selected=='home'?link_black:link_p} onClick={()=>navigate('/dashboard')}><MdHome style={{margin:'0 5px 3px 0'}}/>{collapsed?`Home`:''}</p>
		<div id="underline"></div>
		</div>
		</OverlayTrigger>

		<OverlayTrigger
		placement="right"
		overlay={<Tooltip id="button-tooltip-2">Products</Tooltip>}
		>
		
			<div id="links" 
			style={selected=='products'?collapsed?collapsed_selected_link : SelectedLink:link} >
			<p style={selected=='products'?link_black:link_p} onClick={()=>navigate('/product/all')}><HiArchive style={{margin:'0 5px 3px 0'}}/>{collapsed?`Products`:''}</p>
			<div id="underline"></div>
			</div>
			
			</OverlayTrigger>

			<OverlayTrigger
			placement="right"
			overlay={<Tooltip id="button-tooltip-2">Orders</Tooltip>}
			>
			
			<div id="links" 
			style={selected=='orders'?collapsed?collapsed_selected_link : SelectedLink:link} >
			<p style={selected=='orders'?link_black:link_p} onClick={()=>navigate('/orders')}><MdCheck style={{margin:'0 5px 3px 0'}}/>{collapsed?`Orders`:''}</p>
			<div id="underline"></div>
			</div>
			
			</OverlayTrigger>
			
		<OverlayTrigger
		placement="right"
		overlay={<Tooltip id="button-tooltip-2">Account</Tooltip>}
		>
		
			<div id="links" 
			style={selected=='account'?collapsed?collapsed_selected_link : SelectedLink:link} >
			<p style={selected=='account'?link_black:link_p} onClick={()=>navigate('/account')}><MdAccountBox style={{margin:'0 5px 3px 0'}}/>{collapsed?`Account`:''}</p>
			<div id="underline"></div>
			</div>
			
			</OverlayTrigger>

			
		</div>
		
			{
				(collapsed) ?

			(<Button variant="outline-light"  style={logout_show} onClick={action.action}>{action.text}</Button>)
			:
			(<Button variant="outline-light"  style={logout_show} onClick={action.action}><BiLogOut style={{scale:'1.2',marginBottom:4}} /></Button>)
			}
	</div>
	)
}

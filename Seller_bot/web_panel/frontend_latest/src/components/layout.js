import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { GiHamburgerMenu} from '@react-icons/all-files/gi/GiHamburgerMenu';
import './style/layout.css';
import './sidebar_links_animation.css';


const wrapper = {
	display: 'flex',
	background: '#fff'
}
const page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', overflowY: 'auto', width: '100vw', height: '100vh' }

export default function Layout({selected ,children}){
	const [collapsed , setCollapsed] = useState(localStorage.getItem('collapsed') == "true" ? false : true);
	const [show , setShow] = useState(true);
	const [slider , setSlider] = useState(true);

	useEffect(()=>{console.log(show)},[show])
	
	
	return(
	<div id="wrapper" style={wrapper}>
       
	{

		show ? 
        <div className="menu_button" style={{display:slider?'block':'none',alignSelf:'flex-start',padding:12,marginLeft:20,marginTop:'2rem',zIndex:2,position:'fixed',top:'-1rem',right:'1rem',borderRadius:10,boxShadow:'1px 1px 4px #888a'}}>
	<GiHamburgerMenu style={{width:'1.5rem',height:'1.5rem'}} onClick={()=>{
		localStorage.setItem('collapsed' , `${!show}`)

		setShow(!show)
	}}></GiHamburgerMenu>
	</div>
	: null
}
	
        <Sidebar selected={selected} collapsed={collapsed}  setCollapsed={setCollapsed} show={show} setShow={setShow} slider={slider} setSlider={setSlider}/>
		{children}
	 </div>
	)
}
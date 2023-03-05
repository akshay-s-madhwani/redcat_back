import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { isBrowser } from '../utils/isBrowser';


const wrapper = {
	display: 'flex',
	height: 'calc(100vh)',
	background:'rgb(245, 241, 227)'
}

export default function PageWrapper({pageName , children}){
	if(typeof window !== 'undefined'){
	return(
    <div id="wrapper" style={wrapper}>
				<Sidebar selected={pageName} />
				<div style={{ flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', paddingLeft: '11rem', overflowY: 'auto', width: '100vw', height: '100vh' }}>
                {children}
                </div>
            </div>
)
	}else{return null}
}
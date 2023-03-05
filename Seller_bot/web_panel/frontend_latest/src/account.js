import { navigate } from 'gatsby';
import React , {useEffect, useMemo, useState} from 'react';
import account from '../images/icons8-account-32.png';
import Button from 'react-bootstrap/Button';
import { get_seller_details } from '../api_handlers/dashboard_api';
import Layout from './components/layout';


const collapsed_page_wrapper = { flexGrow: 2, flexFlow: 'column', alignItems: 'flex-start', overflowY: 'auto', width: '100vw', height: '100vh' }

export function Account({}){
    const [data , setData] = useState([]);
    cpnst [collapsed , setCollapsed] = useState(false)
    useMemo(()=>{
        get_seller_details()
        .then(data=>{
            setData(...data)
        })
        .catch(err=>console.log(err))
    },[])

    useEffect(()=>console.log(data),[data])
    return(
        <Layout>


			<div id="wrapper" style={wrapper}>
				<Sidebar selected='account' collapsed={collapsed} setCollapsed={setCollapsed} />
				<div style={page_wrapper}></div>
        </div>
        </Layout>
    )
}
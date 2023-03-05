import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import Alert from '../components/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import {  EditSVGIcon, SearchSVGIcon } from '@react-md/material-icons';
import { get_seller_details } from '../api_handlers/dashboard_api';
import { add_collection_point, change_password } from '../api_handlers/account_api';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Typography } from '@mui/material';


const page_wrapper = {  display:'flex' ,flexGrow: 2, flexFlow: 'column', alignItems: 'center', paddingLeft: '12.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }
const collapsed_page_wrapper = { display:'flex' , flexGrow: 2, flexFlow: 'column', alignItems: 'center', paddingLeft: '6.5rem', overflowY: 'auto', width: '100vw', height: '100vh' }

const details_wrap = {
    display:"flex",
    flexFlow:'column',
    padding:16,
    alignItems:'flex-start',
    justifyContent: 'space-evenly'
}

const details = {
    display:'flex',
    alignItems:'baseline',
    gap:'2rem'
}

const list_style = {listStyle:'none', padding:'1rem' , borderRadius:10 , background:'rgb(66 59 185 / 83%)' , boxShadow:'rgb(81 165 225 / 81%) 0px 0px 14px inset'};

const account_card = {
        width:"55vw",
        display:"flex", 
        flexFlow:"column", 
        alignItems:"center", 
        color:"#fff",
        background:'#6474c3',
        margin: '2rem',
        padding: '1rem 0',
        borderRadius: 15
}
const error_form = {
  color:'red',
  padding:'6px 10px'
}

const logo_ = {
	width:'4.5rem',
	margin:'0',
	transform: 'translate(-14px, 11px)',
	zIndex:1
}

export async function getServerData() {
    const data = await get_seller_details()
  
    return {
      props: {
        data,
      },
    }
  }
  

export default function Account(){
	if(typeof window !== 'undefined'){
    
  
    // let {data} = serverData;
  const collapsed_state = localStorage.getItem('collapsed');
  const [data , setData] = useState()
	const [error , setError] = useState(false);
	
  const [ changedData , setChangedData ] = useState({msg:'',heading:""})
  const [Tag , setTag] = useState('');

  const [ current , setCurrent ] = useState('');
  const [ confirm , setConfirm ] = useState('');
  const [ newpass , setNewPass ] = useState('');

  const [ currentError , setCurrentError ] = useState('');
  const [ confirmError , setConfirmError ] = useState('');
  const [ newpassError , setNewPassError ] = useState('');

  const [collectionData , setCollectionData] = useState([])
	const [colError , setColError] = useState(false);

  const [ collectionHouse , setCollectionHouse ] = useState('');
  const [ collectionStreet , setCollectionStreet ] = useState('');
  const [ collectionBuilding , setCollectionBuilding ] = useState('');

  const [ houseError , setHouseError ] = useState('');
  const [ streetError , setStreetError ] = useState('');
  const [ buildingError , setBuildingError ] = useState('');

  const [ showAlert , setShowAlert ] = useState(false)
    
    useEffect(()=>{
        get_seller_details()
		.then(data=>{
            console.log(data)
			if(data){
                setData(data.seller)
                if(data.seller.collection_points){
                setCollectionData([...data.seller.collection_points])
              }
			}
			else{
                setError('We weren\'t able to get your data, please try again later')
			}
		})
		.catch(e=>{
            console.log(e)
            setError('Something Went wrong While looking for Account details ')
		});
    },[]);
    
    useEffect(()=>{
        console.log(data)
    },[])
	
    // const toggleChanger = (tag)=>{
    //   setChanger(true);
    //   setTag(tag)
    // };

    const changePassword = (e)=>{
      console.log(e)
      
      setCurrentError('');
      setConfirmError('');
      setNewPassError('');
      if(!current){
        setCurrentError('Cannot be left blank')
      }
      if(!confirm){
        setConfimError('Cannot be left blank')
      }
      if(!newpass){
        setNewPassError('Cannot be left blank')
      }

      if(newpass !== confirm){
        console.log(newpass , confirm)
        setConfirmError('Passwords Do not match');
        return
      }
      change_password(current , newpass)
      .then(response=>{
        let {msg , success} = response;
        if(!success){
          setCurrentError(msg);
          return
        }
        scrollTo(0,0)
        setShowAlert(true);
        setChangedData({msg:"Password have been changed",heading:"Success"})
      })

    }

    const addCollectionPoint = (e)=>{
      console.log(e)
      e.preventDefault();

      setHouseError('');
      setStreetError('');
      setBuildingError('');
      if(!collectionHouse){
        setHouseError('Cannot be left blank')
      }
      if(!collectionStreet){
        setStreetError('Cannot be left blank')
      }
      if(!collectionBuilding){
        setBuildingError('Cannot be left blank')
      }

      
      add_collection_point(collectionHouse , collectionStreet , collectionBuilding)
      .then(response=>{
        let {msg , success} = response;
        if(!success){
          setCurrentError(msg);
          return
        }
        scrollTo(0,0)
        setShowAlert(true);
        location.reload();
      })

    }
  
    return(
        <Layout selected={'Home'}>
  
				{

                    (error || !data) ? 
				<div style={{width: '100vw', height: 'calc(100vh)',background:'azure',display:'grid',placeItems:'center'}}>
				<p>{error}</p>
				</div>
					:
				<div style={
                    page_wrapper
					}>
          {
            showAlert?
          <Alert msg={changedData.msg} variant="success" heading={changedData.heading}/>
          :null
          }
            <Container style={account_card} lg={4} md={8} sm={12}>
                    <h3 style={{padding:'0 1rem'}}>Account Details</h3>
                    <Row style={details_wrap}>
                    <Row style={details}><Typography><p ><span style={{fontWeight:700,fontSize:18}}>Shop Name: </span> {data.shop_name || ''}</p></Typography> </Row>
                    <Row style={details}><Typography><p ><span style={{fontWeight:700,fontSize:18}}>Number: </span>{data.number}</p></Typography></Row>
                    <Row style={details}><Typography><p ><span style={{fontWeight:700,fontSize:18}}>Email: </span>{data.email || ''}</p></Typography></Row>
                    <Row style={details}><Typography><p ><span style={{fontWeight:700,fontSize:18}}>Currency: </span>{data.currency || 'HKD'}</p></Typography></Row>
                    <Row style={details}><Typography><span style={{fontWeight:700,fontSize:18}}>Address:</span></Typography>
                    <Col>
                    <ul style={list_style}>
                      <li style={{display:'flex',gap:'1rem'}}><p style={{fontWeight:"700"}}>House:</p><span>{data.address?data.address.house:''}</span></li>
                      <li style={{display:'flex',gap:'1rem'}}><p style={{fontWeight:"700"}}>Building:</p><span>{data.address?data.address.building:''}</span></li>
                      <li style={{display:'flex',gap:'1rem'}}><p style={{fontWeight:"700"}}>Street:</p><span>{data.address?data.address.street:''}</span></li>
                      <li style={{display:'flex',gap:'1rem'}}><p style={{fontWeight:"700"}}>City:</p><span>{data.address?data.address.city:''}</span></li>
                      
                    </ul></Col>
                    </Row>
                </Row>
                </Container>

                    <hr style={{width:'100%'}}/>
                    
                    <Container style={account_card}>
                    <h3 style={{color:'#fff'}}>Collection Points</h3>
                    <div style={{maxHeight:'12rem', overflow:'auto'}}>
                      {
                        
                        (collectionData.length ) ?
                          collectionData.map(i=>{
                           let address = JSON.parse(i.address);
                           console.log(address)
                           return(             
                          <div style={list_style}>
                          <h4>{i.name}</h4>
                          <div >
                          <span>Street: {address.street}</span> &nbsp;
                          <span>Building: {address.building}</span>
                          </div>
                          </div>
                           )
                        })
                      :
                      null
                        
                        
                      }
                      {
                        (!collectionData.length) && (
                          <p>No Collection Points found</p>
                        )
                      }
                    </div>
                    <h3 style={{marginTop:"2rem"}}>Add Collection Points</h3>
                    <Form no-validate="true" style={{width:"50%"}} onKeyPress={(e)=>{if(e.key === "13"){addCollectionPoint(e)}}}>
                    <Form.Label name="current" forHTML="house">Shop / House number</Form.Label>
                    <Form.Control type="text" id="current" placeholder="Enter Shop Number / house Number" onChange={(e=>setCollectionHouse(e.target.value))} />
                    <Form.Label name="current" forHTML="street">Street name</Form.Label>
                    <Form.Control type="text" id="current" placeholder="Enter Street" onChange={(e=>setCollectionStreet(e.target.value))} />
                    <Form.Label name="current" forHTML="building">Building Name</Form.Label>
                    <Form.Control type="text" id="current" placeholder="Enter Building name" onChange={(e=>setCollectionBuilding(e.target.value))} />
                    <Button variant='warning' className="mt-1" type="submit" onClick={(e)=>addCollectionPoint(e)}><p style={{color:"#fff",fontWeight:600,padding:0,margin:0}}>+ Add</p></Button>
                    </Form>
                  </Container>
                  
                    <hr style={{width:'100%'}}/>
                  <div style={account_card}>
                    <h3 style={{color:'#fff'}}>Change Password</h3>
                    
                    <Form no-validate="true" onKeyPress={(e)=>{if(e.key === "13"){changePassword()}}}>
                    <Form.Label name="current" for="current">Current Password</Form.Label>
                    <Form.Control type="password" id="current" placeholder="Enter existing Password" onChange={(e)=>setCurrent(e.target.value)}></Form.Control>
                    {currentError.length ? <p style={error_form}>{currentError}</p>:null}
                    <Form.Label name="new" for="new">New Password</Form.Label>
                    <Form.Control type="password" id="new" placeholder="Enter New Password to reset" onChange={(e)=>setNewPass(e.target.value)}></Form.Control>
                    {newpassError.length ? <p style={error_form}>{newpassError}</p>:null}
                    <Form.Label name="confirm" for="confirm">Confirm Password</Form.Label>
                    <Form.Control type="password" id="confirm" placeholder="Confirm New Password" onChange={(e)=>setConfirm(e.target.value)}></Form.Control>
                    {confirmError.length ? <p style={error_form}>{confirmError}</p>:null}
                    <br/>
                    <Button variant='warning' type="submit" onClick={(e)=>changePassword(e)}>Reset</Button>
                    </Form>
                    </div>
            
				</div>
				}
		</Layout>
    )
}
}
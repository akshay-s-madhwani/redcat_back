import { DeleteSVGIcon, EditSVGIcon, RemoveRedEyeSVGIcon } from '@react-md/material-icons';
import { Confirm } from 'notiflix';

import React , {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import { delete_products } from '../api_handlers/products_api';


export default function ProductTable({editable , setEditable, products , setProducts , checked , setChecked , tab , setEditingInto}){
    
    useEffect(()=>{
        setEditable([]);
    },[])
    const handleCheckbox = (e)=>{
        let key  = e.target.dataset.key
        console.log(e.target.checked)
        if(!e.target.checked){
            setEditable(i=>{
                let old_editables = i.filter(j=>j!==key)
                console.log('old_editables' , old_editables)
                return [...old_editables]
            })
        }
        else{   
        if(!editable.includes(key)){
        setEditable(i=>[ key , ...i])
    }
    }
    }
    
    useEffect(()=>{
        console.log(products)
    console.log(editable);
    if(!editable.length){
        setChecked(false)
    }else{
        if(editable.length === 1){
            setEditingInto(editable[0])
        }else{setEditingInto()}
        if(!checked){
            setChecked(true)
        }
    }
    
    },[editable])
    return(
    <div style={{width:'90vw',overflowX:'auto'}}>
    <Table hover  style={{margin:'1rem 0'}}>
    <thead>
    <tr>
	<th></th>
    <th>No.</th>
    <th>Status</th>
    <th>Image</th>
    <th>Title</th>
    <th>Price</th>
    <th>Regular price</th>
    <th>Stock</th>
    <th>Category</th>
    <th>Description</th>
    <th>Colors</th>
    <th>Sizes</th>
    <th>Variations</th>
    </tr>
    </thead>
    <tbody>
    {

    	products.length ?
    	products.map((i,j)=>{
			if(!i){ return(
              <p>No Products Found</p>  
            )
        }

    	return(
    	<tr>
		<td data-key={i._id}>
        <Form.Check type="checkbox" style={{width:'1.5rem',height:'1.5rem'}} data-key={i._id} onClick={e=>handleCheckbox(e)} />
        </td>
    	<td>
    	{j}
    	</td>
    	<td>{i.status?i.status:'private'}</td>
    	{(i.imageData || i.image)?
            <td >
            <div style={{width:160 , paddingBottom:12 , height:160 }}>
            <div style={{width:160 , height:160 }}>
            <div style={{width:140,height:160 , borderRadius:10 , background:"#fff", overflow:'hidden' , display:"inline-block"}}>
    		<img src={i.imageData || i.image} style={{width:140}}  alt={i.title}/>
            </div>
            </div>
            </div>
			</td>
            :
            <td >
			{i.image.replace('./static/images/','')}
			<br></br>
    		<span style={{border:'#e11',color:'red'}}>Image Required {console.log(i)}</span>
    		</td>
    	}
    	<td style={{marginLeft:'1rem'}}><b>{i.title}</b></td>
    	<td>{i.price}</td>
    	<td>{i.originalPrice}</td>
    	<td>{i.stock}</td>
    	<td>{i.category}</td>
    	<td style={{padding:'0.5rem 0.2rem'}}><div style={{width:'190px',height:160,background:'transparent',border:0,resize:'both',overflow:'auto'}}>{i.description}</div></td>
    	<td>{i.colors}</td>
    	<td>{i.sizes}</td>
    	<td>{i.variations}</td>
    	</tr>
    )
    })
:
null}
    </tbody>
    </Table>
    </div>
    )
}
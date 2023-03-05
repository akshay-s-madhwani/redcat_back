import { DeleteSVGIcon, EditSVGIcon, RemoveRedEyeSVGIcon } from '@react-md/material-icons';
import { Confirm } from 'notiflix';

import React , {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import { delete_products } from '../api_handlers/products_api';


export default function UploadTable({editable , setEditable, products , setProducts , checked , setChecked , tab , setEditingInto}){
    
    useEffect(()=>{
        
        setEditable([]);
    },[])
    const handleCheckbox = (e)=>{
        let key  = e.target.dataset.key
        if(!e.target.checked){
            setEditable(i=>{
                let old_editables = i.filter(j=>j!==Number(key))
                console.log(old_editables)
                return [...old_editables]
            })
        }
        else{
        
        if(!editable.includes(key)){
        setEditable(i=>[ e.target.dataset.key , ...i])
    };
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
    
    },[editable]);


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
			if(!i){ return }
    		return(
    	<tr>
		<td data-key={i.product_id}><Form.Check type="checkbox" style={{width:'1.5rem',height:'1.5rem'}} data-key={i.product_id} onClick={e=>handleCheckbox(e)} /></td>
    	<td>
    	{j}
    	</td>
    	<td>{i.status?i.status:'private'}</td>
    	{(i.hasImage)?
            <td style={{width:185 , display:'block',paddingBottom:12 , marginRight:'-1rem'}}>
    		<img src={i.imageData || i.image} style={{maxWidth: 150 , minWidth:120 ,borderRadius:10 , maxHeight:190 , minHeight:160}} alt={i.title}/>
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
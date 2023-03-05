import React from 'react';
import { DropdownMenu, MenuItem } from "@react-md/menu";
import { DeleteSVGIcon, EditSVGIcon, RemoveRedEyeSVGIcon , MoreVertSVGIcon } from '@react-md/material-icons';
import { delete_products } from '../api_handlers/products_api';

export default function ProductMenu(){
    return(
        <DropdownMenu buttonChildren={<MoreVertSVGIcon/>}>
        <MenuItem><DeleteSVGIcon fill="#fff" /> Delete</MenuItem>
        <MenuItem><EditSVGIcon fill="#fff"/> Edit</MenuItem>
        </DropdownMenu>
    )
}
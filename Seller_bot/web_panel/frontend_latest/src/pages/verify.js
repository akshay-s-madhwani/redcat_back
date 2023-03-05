import React , {useEffect, useState} from 'react';
import Spinner from "react-bootstrap/Spinner";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import { shouldVerify, verifyOTP } from '../api_handlers/account_api';
import { navigate } from 'gatsby';

const container = {
    display: 'grid',
    placeItems:'center',
    height:'100vh'
}

const box = {
    width:'50rem',
    height: '20rem',
    borderRadius:10,
    padding:'1rem',
    boxShadow:'#4f49 0px 1px 16px 1px',
}

const innerBox = {
    display:'flex',
    flexFlow:'column',
    alignItems:'center',
}

const form_error = {
    color:'red',
    fontSize:14,
    marginLeft:12
}

export default function VerifyOtp(){
    const [ loaded , setLoaded ] = useState(false);
    const [ value , setValue ] = useState('');
    const [error_err, setError_err] = useState('')

    const stabilise_form = (e)=>{
        e.preventDefault();
        e.stopPropagation()
    }

    useEffect(() => {
      shouldVerify()
      .then(notVerified=>{
        if(!notVerified.success){
            navigate('/login')
        }

      })
      .catch(e=>{
        navigate('/login')
      })
    }, [])

    const check_otp = async()=>{
        try{
        let payload = await verifyOTP(value)
                if(!payload.success){
                    setError_err(payload.msg)
                }
                setLoaded(false);
                setTimeout(()=>{navigate('/dashboard')},1500);
            }
            catch(e){
                console.trace(e)
            }
    }
    
    
    return(
        <div style={container}>
        <Form noValidate onSubmit={()=>stabilise_form} validated={false} onKeyDown={(e)=>e.key === 'Enter'?check_otp():null}  controlId="formGroup" className="mb-3" style={box}>
        <h3 style={{textAlign:'center'}}>Please verify to proceed</h3>
        <h4 style={{textAlign:'center' , marginBottom:'1rem'}}>You will receive an OTP in your Whatsapp</h4>
        {
            loaded ? 
            <div style={{display:'grid',placeItems:'center',height:'70%'}}>
            <Spinner variant="primary" animation="border"/>
            </div>
            :
            <div style={innerBox}>
            <FloatingLabel controlId="floatingInput" label="Enter OTP">
        <Form.Control onChange={(e)=>setValue(e.target.value)} placeholder="OTP" />
		<p className="form-error" style={form_error}>{error_err}</p>
      </FloatingLabel>
	  
		<Button variant='primary' onClick={check_otp} >Verify</Button>		
            </div>
        }
        </Form>
        </div>
    )
}

import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

export default function AlertDismissibleExample({heading , msg , variant}) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant={variant} onClose={() => setShow(false)} style={{position: 'fixed' , boxShadow: '1px 1px 30px 1px #999' , width: '80vw' , top: '30vh'}} dismissible>
        <Alert.Heading>{heading}</Alert.Heading>
        <p>
          {msg}
        </p>
      </Alert>
    );
  }
  
}


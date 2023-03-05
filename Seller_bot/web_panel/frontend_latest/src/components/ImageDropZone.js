import React , { useState , useEffect , useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

const dropStage = {
	margin:'2rem 0',
	width:'95%',
	height:'10rem',
	borderRadius:'15px',
	border:'2px dashed #f4f',
	display:'flex',
	justifyContent:'center',
	alignItems:'center',
	padding:'2rem'
}



export default function ImageDropZone({waiting , setWaiting , setImages , setFloat}){
		  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
      // Do whatever you want with the file contents
      if(waiting === 'images'){
      	console.log(reader.result);
      	setImages(i=>[...i ,{name:file.name , data:reader.result}]);

      }
  }
    reader.readAsDataURL(file)
});
    setFloat(false)
});
	const {getRootProps, getInputProps} = useDropzone({onDrop});

	return(
			<div {...getRootProps()} style={dropStage}>
      <input {...getInputProps()} />
      
      <p>Now, Drop all your product images at once or Click here to Browse</p> 
    </div>
		)
}
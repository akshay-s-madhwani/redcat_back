import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { navigate } from 'gatsby'
import { isBrowser } from '../utils/isBrowser'


const pageStyles = {
	color: '#232129',
	padding: 96,
	fontFamily: '-apple-system, Roboto, sans-serif, serif',
}

const headerStyles = {
	height:65 , 
  background:'#2B221A',
	color:'#eee',
	display:'grid',
	gridTemplateColumns:'1fr 6fr 1fr',
	padding:'.6rem',
	justifyItems:'center',
	alignItems:'center',
	fontFamily:'sans-serif',
	fontWeight:'700'
}

const loginLayout = {
	display:'flex',
	justifyContent:'center',
	alignItems:'center',
	margin:'auto',
	padding:'7%',
}
const headingStyles = {
	marginTop: 0,
	marginBottom: 64,
	maxWidth: 320,
}
const headingAccentStyles = {
	color: '#663399',
}

const docLink = {
	text: 'Documentation',
	url: 'https://www.gatsbyjs.com/docs/',
	color: '#8954A8',
}

const links = [
	
	{
		text: 'Plugin Library',
		url: 'https://www.gatsbyjs.com/plugins',
		description:
      'Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.',
		color: '#8EB814',
	},
	{
		text: 'Build and Host',
		url: 'https://www.gatsbyjs.com/cloud',
		badge: true,
		description:
      'Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!',
		color: '#663399',
	},
]

const IndexPage = () => {
	if(typeof window !== 'undefined'){
	return navigate('/signup')
	}else{return null}
	
}

export default IndexPage

export const Head = () => (
	<title>
Home Page
	</title>
)

import React from 'react'
import './Authorization.css'
import { Link } from 'react-router-dom'

import { iconGmail, iconLogo } from '../../../Assets/Assets'

const Authorization = () => {
	const handleGoogleLogin = () => {
		console.log('Google login clicked')
		// api log in with gmail
		alert('Google login (mock)')
	}

	return (
		<main className='authorization-main'>
			<div className='authorization-box'>
				<h1 className='authorization-title'>Authorization</h1>

				<Link to='/LogIn' className='no_underline'>
					<button className='authorization-button'>
						<img src={iconLogo} alt='Vortex' className='authorization-icon' />
						Login with Vortex
					</button>
				</Link>

				<button className='authorization-button' onClick={handleGoogleLogin}>
					<img src={iconGmail} alt='Google' className='authorization-icon' />
					Login with Gmail
				</button>

				<div className='authorization-divider'>
					<hr />
					<span>or</span>
					<hr />
				</div>

				<Link to='/SignUp' className='no_underline'>
					<button className='authorization-button'>Create a New Account</button>
				</Link>
			</div>
		</main>
	)
}

export default Authorization

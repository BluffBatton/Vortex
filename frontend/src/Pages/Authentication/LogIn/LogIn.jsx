import React, { useState } from 'react'
import './LogIn.css'
import { Link } from 'react-router-dom'

const LogIn = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleLogin = () => {
		console.log('Logging in with:', { email, password })
		// api log in
		alert('Login (mock): ' + email)
	}

	return (
		<main className='login-main'>
			<div className='login-box'>
				<h1 className='login-title'>Log In</h1>

				<div className='login-input-group'>
					<p className='login-input-label'>Email</p>
					<input
						type='email'
						className='login-input-field'
						placeholder='test@gmail.com'
						aria-label='Enter your email'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>

				<div className='login-input-group-pass'>
					<p className='login-input-label-pass'>Password</p>
					<input
						type='password'
						className='login-input-field-pass'
						placeholder='qwerty12345'
						aria-label='Enter your password'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				<button className='login-button' onClick={handleLogin}>
					Log in
				</button>
			</div>
		</main>
	)
}

export default LogIn

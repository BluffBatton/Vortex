import React, { useState } from 'react'
import './SignUp.css'
import { Link } from 'react-router-dom'

const SignUp = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [dob, setDob] = useState('')
	const [password, setPassword] = useState('')

	const handleSignUp = () => {
		console.log('Signing up with:', {
			firstName,
			lastName,
			email,
			phone,
			dob,
			password,
		})
		// api sign up
		alert(`Sign Up (mock): ${firstName} ${lastName}`)
	}

	return (
		<main className='signup-main'>
			<div className='signup-box'>
				<div className='signup-title-wrapper'>
					<h1 className='signup-title'>Sign up</h1>
				</div>

				<div className='signup-form-body'>
					<div className='signup-double-row'>
						<div className='signup-input-group'>
							<p className='signup-input-label'>First Name</p>
							<input
								type='text'
								className='signup-input-field-name'
								placeholder='Tim'
								value={firstName}
								onChange={e => setFirstName(e.target.value)}
							/>
						</div>
						<div className='signup-input-group'>
							<p className='signup-input-label'>Last Name</p>
							<input
								type='text'
								className='signup-input-field-name'
								placeholder='Bradley'
								value={lastName}
								onChange={e => setLastName(e.target.value)}
							/>
						</div>
					</div>

					<div className='signup-input-group'>
						<p className='signup-input-label'>Email</p>
						<input
							type='email'
							className='signup-input-field'
							placeholder='test@gmail.com'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>

					<div className='signup-input-group'>
						<p className='signup-input-label'>Phone number</p>
						<input
							type='text'
							className='signup-input-field'
							placeholder='+380112223344'
							value={phone}
							onChange={e => setPhone(e.target.value)}
						/>
					</div>

					<div className='signup-input-group'>
						<p className='signup-input-label'>Date of birthday</p>
						<input
							type='text'
							className='signup-input-field'
							placeholder='01.01.2001'
							value={dob}
							onChange={e => setDob(e.target.value)}
						/>
					</div>

					<div className='signup-input-group'>
						<p className='signup-input-label'>Password</p>
						<input
							type='password'
							className='signup-input-field'
							placeholder='qwerty12345'
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
				</div>

				<div className='signup-button-wrapper'>
					<button className='signup-button' onClick={handleSignUp}>
						Create a new account
					</button>
				</div>
			</div>
		</main>
	)
}

export default SignUp

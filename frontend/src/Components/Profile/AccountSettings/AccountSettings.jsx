import React, { useState } from 'react'
import './AccountSettings.css'

const AccountSettings = () => {
	const [firstName, setFirstName] = useState('Jonis')
	const [lastName, setLastName] = useState('Barabulka')
	const [phone, setPhone] = useState('+380000000000')
	const [email, setEmail] = useState('test@gmail.com')
	const [password, setPassword] = useState('qwerty12345')

	const handleSave = () => {
		console.log('Saving changes...')
		console.log({
			firstName,
			lastName,
			phone,
			email,
			password,
		})
		// placeholder api save
	}

	return (
		<section className='accsettings-content'>
			<h2 className='accsettings-title'>Account settings</h2>
			<form className='accsettings-form'>
				<label>
					<span className='accsettings-label-text'>First Name</span>
					<input
						type='text'
						className='accsettings-input-field'
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
					/>
				</label>
				<label>
					<span className='accsettings-label-text'>Last Name</span>
					<input
						type='text'
						className='accsettings-input-field'
						value={lastName}
						onChange={e => setLastName(e.target.value)}
					/>
				</label>
				<label>
					<span className='accsettings-label-text'>Phone number</span>
					<input
						type='text'
						className='accsettings-input-field'
						value={phone}
						onChange={e => setPhone(e.target.value)}
					/>
				</label>
				<label>
					<span className='accsettings-label-text'>Email</span>
					<input
						type='text'
						className='accsettings-input-field'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</label>
				<label>
					<span className='accsettings-label-text'>Password</span>
					<input
						type='text'
						className='accsettings-input-field'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</label>
				<button type='button' className='accsettings-save' onClick={handleSave}>
					Save changes
				</button>
			</form>
		</section>
	)
}

export default AccountSettings

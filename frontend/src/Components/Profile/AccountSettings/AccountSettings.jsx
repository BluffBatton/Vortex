import React, { useState, useEffect } from 'react'
import './AccountSettings.css'
import { API_BASE_URL } from '../../../api.js'

const AccountSettings = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('access')
			if (!token) return

			try {
				const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.ok) {
					const data = await response.json()
					setFirstName(data.first_name || '')
					setLastName(data.last_name || '')
					setPhone(data.phone_number || '')
					setEmail(data.email || '')
				}
			} catch (err) {
				console.error('Ошибка при получении данных профиля', err)
			} finally {
				setLoading(false)
			}
		}

		fetchUser()
	}, [])

	const handleSave = async () => {
		const token = localStorage.getItem('access')
		if (!token) return

		const updateData = {
			first_name: firstName,
			last_name: lastName,
			phone_number: phone,
			email: email,
		}

		if (password.trim()) {
			updateData.password = password
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updateData),
			})

			if (response.ok) {
				setPassword('')
				window.location.reload()
			}
		} catch (err) {
			console.error('Ошибка при сохранении изменений', err)
		}
	}

	if (loading) {
		return <p className='accsettings-loading'>Loading...</p>
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
						type='password'
						className='accsettings-input-field'
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder='Enter new password to change it'
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

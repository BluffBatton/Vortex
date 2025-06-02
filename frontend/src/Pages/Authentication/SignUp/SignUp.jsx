import React, { useState } from 'react'
import './SignUp.css'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../api.js'

const SignUp = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleSignUp = async () => {
		setError('')

		try {
			const registerResponse = await fetch(
				`${API_BASE_URL}/api/user/register/`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						first_name: firstName,
						last_name: lastName,
						email,
						phone_number: phone,
						password,
					}),
				}
			)

			if (!registerResponse.ok) {
				const errorData = await registerResponse.json()
				setError(errorData?.detail || 'Ошибка регистрации')
				return
			}

			const loginResponse = await fetch(`${API_BASE_URL}/api/token/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			const loginData = await loginResponse.json()

			if (!loginResponse.ok) {
				setError('Регистрация прошла, но не удалось войти')
				return
			}

			localStorage.setItem('access', loginData.access)
			localStorage.setItem('refresh', loginData.refresh)

			const rolesResponse = await fetch(`${API_BASE_URL}/api/user/roles/`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${loginData.access}`,
				},
			})

			const roles = await rolesResponse.json()

			if (!rolesResponse.ok) {
				setError('Не удалось получить роли после регистрации')
				return
			}

			if (roles.is_superuser) {
				navigate('/Administrator')
			} else if (roles.is_staff) {
				navigate('/ModeratorPage')
			} else {
				navigate('/Profile')
			}
		} catch (err) {
			console.error('Sign-up error:', err)
			setError('Ошибка регистрации. Попробуйте позже.')
		}
	}

	return (
		<main className='signup-main'>
			<div className='signup-box'>
				<div className='signup-title-wrapper'>
					<h1 className='signup-title'>Sign up</h1>
				</div>

				{error && <p className='signup-error'>{error}</p>}

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

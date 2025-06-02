import React, { useState } from 'react'
import './LogIn.css'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../api.js'

const LogIn = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleLogin = async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/api/token/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(data?.detail || 'Неверный email или пароль')
				return
			}

			const access = data.access
			const refresh = data.refresh

			localStorage.setItem('access', access)
			localStorage.setItem('refresh', refresh)

			const rolesResponse = await fetch(`${API_BASE_URL}/api/user/roles/`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access}`,
				},
			})

			const roles = await rolesResponse.json()

			if (!rolesResponse.ok) {
				setError('Не удалось получить роли пользователя')
				return
			}

			const { is_superuser, is_staff } = roles

			if (is_superuser) {
				navigate('/Administrator')
			} else if (is_staff) {
				navigate('/ModeratorPage')
			} else {
				navigate('/Profile')
			}
		} catch (err) {
			console.error('Login error:', err)
			setError('Ошибка входа. Попробуйте позже.')
		}
	}

	return (
		<main className='login-main'>
			<div className='login-box'>
				<h1 className='login-title'>Log In</h1>

				{error && <p className='login-error'>{error}</p>}

				<div className='login-input-group'>
					<p className='login-input-label'>Email</p>
					<input
						type='email'
						className='login-input-field'
						placeholder='test@gmail.com'
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

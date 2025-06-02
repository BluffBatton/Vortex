import React, { useEffect, useState } from 'react'
import './ProfileSidebar.css'
import { useNavigate } from 'react-router-dom'

import {
	iconLogOut,
	iconMenu,
	iconProfile,
	iconSettings,
	iconStatistics,
	iconSad,
} from '../../../Assets/Assets'
import { API_BASE_URL } from '../../../api.js'

const tabs = [
	{ key: 'settings', label: 'Account settings', icon: iconSettings },
	{ key: 'purchase', label: 'Purchase history', icon: iconMenu },
	{ key: 'statistics', label: 'User statistics', icon: iconStatistics },
	{
		key: 'complaints',
		label: 'Complaints and suggestions',
		icon: iconSad,
	},
]

const ProfileSidebar = ({ activeTab, onTabChange }) => {
	const [user, setUser] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchUser = async () => {
			const token = localStorage.getItem('access')
			if (!token) {
				navigate('/LogIn')
				return
			}

			try {
				const response = await fetch(`${API_BASE_URL}/api/user/profile/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (response.ok) {
					const data = await response.json()
					setUser(data)
				} else {
					navigate('/LogIn')
				}
			} catch (err) {
				console.error('Ошибка загрузки профиля:', err)
				navigate('/LogIn')
			}
		}

		fetchUser()
	}, [navigate])

	const handleLogout = () => {
		localStorage.removeItem('access')
		localStorage.removeItem('refresh')
		localStorage.removeItem('user')
		navigate('/')
	}

	return (
		<div className='acchistory-sidebar'>
			<div className='acchistory-profile'>
				<img
					className='acchistory-avatar-img'
					src={iconProfile}
					alt='Profile'
				/>
				<div className='acchistory-username'>
					{user ? `${user.first_name} ${user.last_name}` : ''}
				</div>
			</div>
			<nav className='acchistory-nav'>
				<ul>
					{tabs.map(tab => (
						<li
							key={tab.key}
							className={activeTab === tab.key ? 'acchistory-active' : ''}
							onClick={() => onTabChange(tab.key)}
						>
							<div className='acchistory-nav-item'>
								<img
									src={tab.icon}
									alt={tab.label}
									className='acchistory-nav-icon'
								/>
								<span>{tab.label}</span>
							</div>
						</li>
					))}
				</ul>
			</nav>
			<button className='acchistory-logout' onClick={handleLogout}>
				<div className='acchistory-logout-content'>
					<img src={iconLogOut} alt='' className='acchistory-logout-icon' />
					<span>Log out</span>
				</div>
			</button>
		</div>
	)
}

export default ProfileSidebar

import React from 'react'
import './AdminSidebar.css'
import { useNavigate } from 'react-router-dom'

import {
	iconProfile,
	iconLogOut,
	iconMenu,
	iconLogo,
} from '../../../Assets/Assets'

const AdminSidebar = ({ activeTab, onTabChange }) => {
	const userName = 'Admin'
	const navigate = useNavigate()

	const navItems = [
		{ id: 'price', label: 'Price change' },
		{ id: 'statistics', label: 'Sales Statistics' },
		{ id: 'stations', label: 'Manage Stations' },
		{ id: 'moderators', label: 'Manage Moderators' },
		{ id: 'complaints', label: 'Complaints' },
	]

	const handleLogout = () => {
		localStorage.removeItem('access')
		localStorage.removeItem('refresh')
		localStorage.removeItem('user')
		navigate('/')
	}

	return (
		<div className='adminsidebar-sidebar'>
			<div className='adminsidebar-logo-block'>
				<img
					src={iconLogo}
					alt='Vortex Logo'
					className='adminsidebar-logo-image'
				/>
				<div className='adminsidebar-logo-text'>Vortex</div>
			</div>

			<div className='adminsidebar-side-divider-wrapper'>
				<hr className='adminsidebar-side-divider' />
			</div>

			<div className='adminsidebar-panel-title'>Administrator panel</div>

			<div className='adminsidebar-user-block'>
				<img
					src={iconProfile}
					alt='User Avatar'
					className='adminsidebar-user-avatar'
				/>
				<div className='adminsidebar-user-name'>{userName}</div>
				<button className='adminsidebar-logout' onClick={handleLogout}>
					<img
						src={iconLogOut}
						alt='Logout'
						className='adminsidebar-logout-icon'
					/>
					Log out
				</button>
			</div>

			{navItems.map(item => (
				<div
					key={item.id}
					className={`adminsidebar-nav-item-wrapper ${
						activeTab === item.id ? 'active' : ''
					}`}
					onClick={() => onTabChange(item.id)}
				>
					<div className='adminsidebar-nav-item'>
						<img
							src={iconMenu}
							alt={item.label}
							className='adminsidebar-nav-icon'
						/>
						<span className='adminsidebar-nav-text'>{item.label}</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default AdminSidebar

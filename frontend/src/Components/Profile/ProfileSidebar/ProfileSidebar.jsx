import React from 'react'
import './ProfileSidebar.css'

import {
	iconLogOut,
	iconMenu,
	iconProfile,
	iconSettings,
	iconStatistics,
	iconSad,
} from '../../../Assets/Assets'

const tabs = [
	{ key: 'purchase', label: 'Purchase history', icon: iconMenu },
	{ key: 'statistics', label: 'User statistics', icon: iconStatistics },
	{ key: 'settings', label: 'Account settings', icon: iconSettings },
	{
		key: 'complaints',
		label: 'Complaints and suggestions',
		icon: iconSad,
	},
]

const ProfileSidebar = ({ activeTab, onTabChange }) => {
	return (
		<div className='acchistory-sidebar'>
			<div className='acchistory-profile'>
				<img
					className='acchistory-avatar-img'
					src={iconProfile}
					alt='Profile'
				/>
				<div className='acchistory-username'>Jonis Barabulka</div>
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
			<button className='acchistory-logout'>
				<div className='acchistory-logout-content'>
					<img src={iconLogOut} alt='' className='acchistory-logout-icon' />
					<span>Log out</span>
				</div>
			</button>
		</div>
	)
}

export default ProfileSidebar

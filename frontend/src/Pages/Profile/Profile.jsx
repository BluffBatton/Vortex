import React, { useState } from 'react'
import './Profile.css'

import ProfileSidebar from '../../Components/Profile/ProfileSidebar/ProfileSidebar'
import PurchaseHistory from '../../Components/Profile/PurchaseHistory/PurchaseHistory'
import Complaints from '../../Components/Profile/Complaints/Complaints'
import AccountSettings from '../../Components/Profile/AccountSettings/AccountSettings'
import UserStatistics from '../../Components/Profile/UserStatistics/UserStatistics'

const Profile = () => {
	const [activeTab, setActiveTab] = useState('settings')

	const renderContent = () => {
		switch (activeTab) {
			case 'settings':
				return <AccountSettings />
			case 'purchase':
				return <PurchaseHistory />
			case 'statistics':
				return <UserStatistics />
			case 'complaints':
				return <Complaints />
			default:
				return <AccountSettings />
		}
	}

	return (
		<main className='profile-main'>
			<ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			{renderContent()}
		</main>
	)
}

export default Profile

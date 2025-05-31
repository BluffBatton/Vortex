import React, { useState } from 'react'
import './Profile.css'

import ProfileSidebar from '../../Components/Profile/ProfileSidebar/ProfileSidebar'
import PurchaseHistory from '../../Components/Profile/PurchaseHistory/PurchaseHistory'
import Complaints from '../../Components/Profile/Complaints/Complaints'
import AccountSettings from '../../Components/Profile/AccountSettings/AccountSettings'
import UserStatistics from '../../Components/Profile/UserStatistics/UserStatistics'

const Profile = () => {
	const [activeTab, setActiveTab] = useState('purchase')

	const renderContent = () => {
		switch (activeTab) {
			case 'purchase':
				return <PurchaseHistory />
			case 'statistics':
				return <UserStatistics />
			case 'settings':
				return <AccountSettings />
			case 'complaints':
				return <Complaints />
			default:
				return <PurchaseHistory />
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

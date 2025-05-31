import React, { useState } from 'react'
import './Administrator.css'

import AdminSidebar from '../../Components/AdminProfile/AdminSidebar/AdminSidebar'

import AdminPrice from '../../Components/AdminProfile/AdminPrice/AdminPrice'
import AdminStatistics from '../../Components/AdminProfile/AdminStatistics/AdminStatistics'
import AdminModer from '../../Components/AdminProfile/AdminModer/AdminModer'
import AdminStation from '../../Components/AdminProfile/AdminStation/AdminStation'
import AdminComplaints from '../../Components/AdminProfile/AdminComplaints/AdminComplaints'

const Administrator = () => {
	const [activeTab, setActiveTab] = useState('price')

	const renderContent = () => {
		switch (activeTab) {
			case 'price':
				return <AdminPrice />
			case 'statistics':
				return <AdminStatistics />
			case 'stations':
				return <AdminStation />
			case 'moderators':
				return <AdminModer />
			case 'complaints':
				return <AdminComplaints />
			default:
				return <AdminPrice />
		}
	}

	return (
		<main className='admin-main'>
			<AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
			<div className='admin-content'>{renderContent()}</div>
		</main>
	)
}

export default Administrator

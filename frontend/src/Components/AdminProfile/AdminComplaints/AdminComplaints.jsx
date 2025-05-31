import React, { useState, useEffect } from 'react'
import './AdminComplaints.css'

const AdminComplaints = () => {
	const [dateOrder, setDateOrder] = useState('asc')
	const [statusFilter, setStatusFilter] = useState('all')

	const [modalOpen, setModalOpen] = useState(false)
	const [selectedComplaint, setSelectedComplaint] = useState(null)

	const [allComplaints, setAllComplaints] = useState([
		{
			id: 1,
			date: '20.05.2025',
			viewed: false,
			description: 'Vladik: меня обидели',
		},
		{
			id: 2,
			date: '15.05.2025',
			viewed: false,
			description: 'Oleksandr: набили будку в чугуеве',
		},
		{
			id: 3,
			date: '12.05.2025',
			viewed: true,
			description: 'Denys: запретили оценивать красивых девушек',
		},
		{
			id: 4,
			date: '10.05.2025',
			viewed: false,
			description: 'Jorik: послали нахуй',
		},
		{
			id: 5,
			date: '08.05.2025',
			viewed: false,
			description: 'Vitaliy: Mi amore, mi amore',
		},
	])

	const [filteredComplaints, setFilteredComplaints] = useState([])

	useEffect(() => {
		let result = [...allComplaints]

		if (statusFilter !== 'all') {
			result = result.filter(complaint =>
				statusFilter === 'viewed' ? complaint.viewed : !complaint.viewed
			)
		}

		result.sort((a, b) => {
			const dateA = new Date(a.date.split('.').reverse().join('-'))
			const dateB = new Date(b.date.split('.').reverse().join('-'))
			return dateOrder === 'asc' ? dateA - dateB : dateB - dateA
		})

		setFilteredComplaints(result)
	}, [allComplaints, dateOrder, statusFilter])

	const toggleViewed = id => {
		setAllComplaints(prev =>
			prev.map(complaint =>
				complaint.id === id
					? { ...complaint, viewed: !complaint.viewed }
					: complaint
			)
		)
		console.log('Toggled view status for complaint:', id)
	}

	const handleDelete = id => {
		console.log('Deleting complaint with id:', id)
		// placeholder api delete
		setAllComplaints(prev => prev.filter(complaint => complaint.id !== id))
		alert('Complaint deleted (mock)')
	}

	const applyFilters = () => {
		console.log('Applying filters:', { dateOrder, statusFilter })
		// placeholder api filtr
	}

	const openModal = description => {
		const [sender, ...rest] = description.split(':')
		const complaintText = rest.join(':').trim()
		setSelectedComplaint({
			sender: sender.trim(),
			title: 'Complaint Title Placeholder',
			message: complaintText,
		})
		setModalOpen(true)
	}

	const closeModal = () => {
		setModalOpen(false)
		setSelectedComplaint(null)
	}

	return (
		<main className='admincomplaints-main'>
			<div className='admincomplaints-content'>
				<h2 className='admincomplaints-title'>Complaints Management</h2>
				<hr className='admincomplaints-divider' />

				<div className='admincomplaints-container'>
					<div className='admincomplaints-table-block'>
						<h3 className='admincomplaints-subtitle'>Complaints List</h3>

						<table className='admincomplaints-table'>
							<thead>
								<tr className='admincomplaints-table-header-row'>
									<th className='admincomplaints-table-header-cell'>№</th>
									<th className='admincomplaints-table-header-cell'>Date</th>
									<th className='admincomplaints-table-header-cell'>Status</th>
									<th className='admincomplaints-table-header-cell'>
										Description
									</th>
									<th className='admincomplaints-table-header-cell'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredComplaints.map(complaint => (
									<tr key={complaint.id} className='admincomplaints-table-row'>
										<td className='admincomplaints-table-cell'>
											{complaint.id}
										</td>
										<td className='admincomplaints-table-cell'>
											{complaint.date}
										</td>
										<td className='admincomplaints-table-cell'>
											<input
												type='checkbox'
												checked={complaint.viewed}
												onChange={() => toggleViewed(complaint.id)}
												className='admincomplaints-checkbox'
											/>
										</td>
										<td
											className='admincomplaints-table-cell admincomplaints-description-link'
											onClick={() => openModal(complaint.description)}
										>
											{complaint.description}
										</td>
										<td className='admincomplaints-table-cell'>
											<button
												className='admincomplaints-delete-button'
												onClick={() => handleDelete(complaint.id)}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='admincomplaints-filters-block'>
						<h3 className='admincomplaints-subtitle'>Filters</h3>

						<div className='admincomplaints-filter-group'>
							<label className='admincomplaints-filter-label'>Date Order</label>
							<select
								value={dateOrder}
								onChange={e => setDateOrder(e.target.value)}
								className='admincomplaints-filter-select'
							>
								<option value='asc'>Oldest to Newest</option>
								<option value='desc'>Newest to Oldest</option>
							</select>
						</div>

						<div className='admincomplaints-filter-group'>
							<label className='admincomplaints-filter-label'>
								View Status
							</label>
							<select
								value={statusFilter}
								onChange={e => setStatusFilter(e.target.value)}
								className='admincomplaints-filter-select'
							>
								<option value='all'>All Complaints</option>
								<option value='viewed'>Viewed Only</option>
								<option value='not_viewed'>Not Viewed Only</option>
							</select>
						</div>

						<button
							className='admincomplaints-apply-button'
							onClick={applyFilters}
						>
							Apply Filters
						</button>
					</div>
				</div>

				{modalOpen && selectedComplaint && (
					<div className='admincomplaints-modal-overlay' onClick={closeModal}>
						<div
							className='admincomplaints-modal'
							onClick={e => e.stopPropagation()}
						>
							<button
								onClick={closeModal}
								className='admincomplaints-close-button'
							>
								✕
							</button>
							<h3>Sender: {selectedComplaint.sender}</h3>
							<h4>Title: {selectedComplaint.title}</h4>
							<p>{selectedComplaint.message}</p>
						</div>
					</div>
				)}
			</div>
		</main>
	)
}

export default AdminComplaints

import React, { useState, useEffect } from 'react'
import './AdminModer.css'

const AdminModer = () => {
	const [formData, setFormData] = useState({
		id: null,
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		gasStation: '',
	})

	const [gasStations] = useState([
		'Kharkivska street, 2A, Chuguiv, Kharkiv region, Ukraine',
		'Kyivska street, 10, Kyiv, Ukraine',
		'Lvivska street, 45, Lviv, Ukraine',
	])

	const [moderators, setModerators] = useState([
		{
			id: 1,
			firstName: 'Janis',
			lastName: 'Barabukka',
			email: 'barabukka@gmail.com',
		},
		{ id: 2, firstName: 'Oleg', lastName: '', email: 'oleg@gmail.com' },
		{ id: 3, firstName: 'Vladick', lastName: '', email: 'vladusya@gmail.com' },
		{ id: 4, firstName: 'Jora', lastName: '', email: 'georgiy@gmail.com' },
		{ id: 5, firstName: 'Denis', lastName: '', email: 'denchik228@gmail.com' },
		{
			id: 6,
			firstName: 'Vitaliy',
			lastName: '',
			email: 'vitalkazhvchik@gmail.com',
		},
		{
			id: 7,
			firstName: 'Andriy',
			lastName: '',
			email: 'parkhonenko@gmail.com',
		},
	])

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		if (formData.id) {
			console.log('Updating moderator:', formData)
			// api to update moder
		} else {
			console.log('Adding new moderator:', formData)
			// api to add moder
		}
		alert('Operation successful (mock)')
		resetForm()
	}

	const handleDelete = id => {
		console.log('Deleting moderator with id:', id)
		// api to delete moder
		alert('Moderator deleted (mock)')
	}

	const handleEdit = moderator => {
		setFormData({
			id: moderator.id,
			firstName: moderator.firstName,
			lastName: moderator.lastName || '',
			email: moderator.email,
			password: '',
			gasStation: moderator.gasStation || '',
		})
	}

	const resetForm = () => {
		setFormData({
			id: null,
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			gasStation: '',
		})
	}

	return (
		<main className='adminmoder-main'>
			<div className='adminmoder-content'>
				<h2 className='adminmoder-title'>Manage Moderators</h2>
				<hr className='adminmoder-divider' />

				<div className='adminmoder-container'>
					<div className='adminmoder-form-block'>
						<h3 className='adminmoder-subtitle'>Moderator Details</h3>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>First Name</label>
							<input
								type='text'
								name='firstName'
								value={formData.firstName}
								onChange={handleInputChange}
								className='adminmoder-input'
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Last Name</label>
							<input
								type='text'
								name='lastName'
								value={formData.lastName}
								onChange={handleInputChange}
								className='adminmoder-input'
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Email</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleInputChange}
								className='adminmoder-input'
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Password</label>
							<input
								type='password'
								name='password'
								value={formData.password}
								onChange={handleInputChange}
								className='adminmoder-input'
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Gas Station</label>
							<select
								name='gasStation'
								value={formData.gasStation}
								onChange={handleInputChange}
								className='adminmoder-select'
							>
								<option value=''>Select Gas Station</option>
								{gasStations.map((station, index) => (
									<option key={index} value={station}>
										{station}
									</option>
								))}
							</select>
						</div>

						<button className='adminmoder-save-button' onClick={handleSave}>
							{formData.id ? 'Update Moderator' : 'Add Moderator'}
						</button>
					</div>

					<div className='adminmoder-list-block'>
						<h3 className='adminmoder-subtitle'>Moderators List</h3>

						<div className='adminmoder-list-container'>
							{moderators.map(moderator => (
								<div key={moderator.id} className='adminmoder-list-item'>
									<div className='adminmoder-list-info'>
										<span className='adminmoder-list-name'>
											{moderator.firstName} {moderator.lastName}
										</span>
										<span className='adminmoder-list-email'>
											{moderator.email}
										</span>
									</div>
									<div className='adminmoder-list-actions'>
										<button
											className='adminmoder-edit-button'
											onClick={() => handleEdit(moderator)}
										>
											Edit
										</button>
										<button
											className='adminmoder-delete-button'
											onClick={() => handleDelete(moderator.id)}
										>
											Delete
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AdminModer

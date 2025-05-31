import React, { useState, useEffect } from 'react'
import './AdminStation.css'

const AdminStation = () => {
	const [formData, setFormData] = useState({
		id: null,
		name: '',
		address: '',
		latitude: '',
		longitude: '',
		price92: '',
		price95: '',
		price100: '',
		priceGas: '',
		priceDiesel: '',
		moderator: '',
	})

	const [moderators] = useState([
		{ id: 1, name: 'John Doe' },
		{ id: 2, name: 'Jane Smith' },
		{ id: 3, name: 'Mike Johnson' },
	])

	const [stations, setStations] = useState([
		{
			id: 1,
			name: 'Chuguev№1',
			address: 'berlinerstr 15a',
			latitude: '50.12345',
			longitude: '36.12345',
			price92: '51.00',
			price95: '54.00',
			price100: '66.99',
			priceGas: '23.50',
			priceDiesel: '52.00',
			moderator: 'John Doe',
		},
		{
			id: 2,
			name: 'Kharkiv№2',
			address: 'peremoga str 52',
			latitude: '49.98765',
			longitude: '36.98765',
			price92: '52.00',
			price95: '55.00',
			price100: '67.99',
			priceGas: '24.00',
			priceDiesel: '53.00',
			moderator: 'Jane Smith',
		},
		{
			id: 3,
			name: 'Donetsk4',
			address: 'donbaskaya31',
			latitude: '48.12345',
			longitude: '37.12345',
			price92: '50.00',
			price95: '53.00',
			price100: '65.99',
			priceGas: '23.00',
			priceDiesel: '51.00',
			moderator: 'Mike Johnson',
		},
	])

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		if (formData.id) {
			console.log('Updating station:', formData)
			// api update station
		} else {
			console.log('Adding new station:', formData)
			// api add station
		}
		alert('Operation successful (mock)')
		resetForm()
	}

	const handleDelete = id => {
		console.log('Deleting station with id:', id)
		// api delete station
		alert('Station deleted (mock)')
	}

	const handleEdit = station => {
		setFormData({
			id: station.id,
			name: station.name,
			address: station.address,
			latitude: station.latitude,
			longitude: station.longitude,
			price92: station.price92,
			price95: station.price95,
			price100: station.price100,
			priceGas: station.priceGas,
			priceDiesel: station.priceDiesel,
			moderator: station.moderator,
		})
	}

	const resetForm = () => {
		setFormData({
			id: null,
			name: '',
			address: '',
			latitude: '',
			longitude: '',
			price92: '',
			price95: '',
			price100: '',
			priceGas: '',
			priceDiesel: '',
			moderator: '',
		})
	}

	return (
		<main className='adminstation-main'>
			<div className='adminstation-content'>
				<h2 className='adminstation-title'>Manage Stations</h2>
				<hr className='adminstation-divider' />

				<div className='adminstation-container'>
					<div className='adminstation-form-block'>
						<h3 className='adminstation-subtitle'>Station Details</h3>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Name</label>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								className='adminstation-input'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Address</label>
							<input
								type='text'
								name='address'
								value={formData.address}
								onChange={handleInputChange}
								className='adminstation-input'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Latitude</label>
							<input
								type='text'
								name='latitude'
								value={formData.latitude}
								onChange={handleInputChange}
								className='adminstation-input'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Longitude</label>
							<input
								type='text'
								name='longitude'
								value={formData.longitude}
								onChange={handleInputChange}
								className='adminstation-input'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Price 92</label>
							<input
								type='number'
								name='price92'
								value={formData.price92}
								onChange={handleInputChange}
								className='adminstation-input'
								step='0.01'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Price 95</label>
							<input
								type='number'
								name='price95'
								value={formData.price95}
								onChange={handleInputChange}
								className='adminstation-input'
								step='0.01'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Price 100</label>
							<input
								type='number'
								name='price100'
								value={formData.price100}
								onChange={handleInputChange}
								className='adminstation-input'
								step='0.01'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Price Gas</label>
							<input
								type='number'
								name='priceGas'
								value={formData.priceGas}
								onChange={handleInputChange}
								className='adminstation-input'
								step='0.01'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Price Diesel</label>
							<input
								type='number'
								name='priceDiesel'
								value={formData.priceDiesel}
								onChange={handleInputChange}
								className='adminstation-input'
								step='0.01'
							/>
						</div>

						<div className='adminstation-form-group'>
							<label className='adminstation-label'>Moderator</label>
							<select
								name='moderator'
								value={formData.moderator}
								onChange={handleInputChange}
								className='adminstation-select'
							>
								<option value=''>Select Moderator</option>
								{moderators.map(moderator => (
									<option key={moderator.id} value={moderator.name}>
										{moderator.name}
									</option>
								))}
							</select>
						</div>

						<button className='adminstation-save-button' onClick={handleSave}>
							{formData.id ? 'Update Station' : 'Add Station'}
						</button>
					</div>

					<div className='adminstation-list-block'>
						<h3 className='adminstation-subtitle'>Stations List</h3>

						<div className='adminstation-list-container'>
							{stations.map(station => (
								<div key={station.id} className='adminstation-list-item'>
									<div className='adminstation-list-info'>
										<span className='adminstation-list-name'>
											{station.name}
										</span>
										<span className='adminstation-list-address'>
											{station.address}
										</span>
										<div className='adminstation-list-prices'>
											<span>A-92: {station.price92} ₴</span>
											<span>A-95: {station.price95} ₴</span>
											<span>A-100: {station.price100} ₴</span>
											<span>GAS: {station.priceGas} ₴</span>
											<span>Diesel: {station.priceDiesel} ₴</span>
										</div>
									</div>
									<div className='adminstation-list-actions'>
										<button
											className='adminstation-edit-button'
											onClick={() => handleEdit(station)}
										>
											Edit
										</button>
										<button
											className='adminstation-delete-button'
											onClick={() => handleDelete(station.id)}
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

export default AdminStation

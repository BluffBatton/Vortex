import React, { useState, useEffect } from 'react'
import './AdminStation.css'
import axios from 'axios'

const API_BASE_URL =
	'https://gregarious-happiness-production.up.railway.app/api'

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
		moderator_id: null,
	})

	const [moderators, setModerators] = useState([])
	const [stations, setStations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [moderatorsRes, stationsRes] = await Promise.all([
					axios.get(`${API_BASE_URL}/moderators/`),
					axios.get(`${API_BASE_URL}/gas-stations/`),
				])

				setModerators(moderatorsRes.data)
				setStations(stationsRes.data)
				setLoading(false)
			} catch (err) {
				setError(err.message)
				setLoading(false)
				console.error('Error fetching data:', err)
			}
		}

		fetchData()
	}, [])

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleModeratorChange = e => {
		const moderatorName = e.target.value
		const moderator = moderators.find(
			m => `${m.first_name} ${m.last_name}` === moderatorName
		)
		setFormData(prev => ({
			...prev,
			moderator: moderatorName,
			moderator_id: moderator ? moderator.id : null,
		}))
	}

	const handleSave = async () => {
		try {
			const dataToSend = {
				...formData,
				moderator: formData.moderator_id,
			}

			if (formData.id) {
				await axios.put(
					`${API_BASE_URL}/gas-stations/${formData.id}/`,
					dataToSend
				)
			} else {
				await axios.post(`${API_BASE_URL}/gas-stations/`, dataToSend)
			}

			const response = await axios.get(`${API_BASE_URL}/gas-stations/`)
			setStations(response.data)

			alert('Operation successful')
			resetForm()
		} catch (error) {
			console.error('Error saving station:', error)
			alert('Unavailable moderator')
		}
	}

	const handleDelete = async id => {
		if (window.confirm('Are you sure you want to delete this station?')) {
			try {
				await axios.delete(`${API_BASE_URL}/gas-stations/${id}/`)

				const response = await axios.get(`${API_BASE_URL}/gas-stations/`)
				setStations(response.data)

				alert('Station deleted successfully')
			} catch (error) {
				console.error('Error deleting station:', error)
				alert('Error deleting station')
			}
		}
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
			moderator: station.moderator.first_name
				? `${station.moderator.first_name} ${station.moderator.last_name}`
				: station.moderator.email,
			moderator_id: station.moderator.id,
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
			moderator_id: null,
		})
	}

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

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
								onChange={handleModeratorChange}
								className='adminstation-select'
							>
								<option value=''>Select Moderator</option>
								{moderators.map(moderator => (
									<option
										key={moderator.id}
										value={`${moderator.first_name} ${moderator.last_name}`}
									>
										{moderator.first_name} {moderator.last_name} (
										{moderator.email})
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
										<span className='adminstation-list-moderator'>
											Moderator:{' '}
											{station.moderator.first_name
												? `${station.moderator.first_name} ${station.moderator.last_name}`
												: station.moderator.email}
										</span>
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

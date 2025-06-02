import React, { useState, useEffect } from 'react'
import './AdminModer.css'
import axios from 'axios'

const API_BASE_URL =
	'https://gregarious-happiness-production.up.railway.app/api'

const AdminModer = () => {
	const [formData, setFormData] = useState({
		id: null,
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		gas_station_id: null,
	})

	const [gasStations, setGasStations] = useState([])
	const [moderators, setModerators] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [stationsRes, moderatorsRes] = await Promise.all([
					axios.get(`${API_BASE_URL}/gas-stations/`),
					axios.get(`${API_BASE_URL}/moderators/`),
				])

				setGasStations(stationsRes.data)
				setModerators(moderatorsRes.data)
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

	const handleGasStationChange = e => {
		const stationId = e.target.value
		setFormData(prev => ({
			...prev,
			gas_station_id: stationId ? parseInt(stationId) : null,
		}))
	}

	const handleSave = async () => {
		try {
			if (formData.id) {
				await axios.put(`${API_BASE_URL}/moderators/${formData.id}/`, formData)
			} else {
				await axios.post(`${API_BASE_URL}/moderators/`, {
					...formData,
					is_staff: true,
				})
			}

			const response = await axios.get(`${API_BASE_URL}/moderators/`)
			setModerators(response.data)

			alert('Operation successful')
			resetForm()
		} catch (error) {
			console.error('Error saving moderator:', error)
			alert('Unavailable station')
		}
	}

	const handleDelete = async id => {
		if (window.confirm('Are you sure you want to delete this moderator?')) {
			try {
				await axios.delete(`${API_BASE_URL}/moderators/${id}/`)

				const response = await axios.get(`${API_BASE_URL}/moderators/`)
				setModerators(response.data)

				alert('Moderator deleted successfully')
			} catch (error) {
				console.error('Error deleting moderator:', error)
				alert('Error deleting moderator')
			}
		}
	}

	const handleEdit = moderator => {
		setFormData({
			id: moderator.id,
			first_name: moderator.first_name,
			last_name: moderator.last_name || '',
			email: moderator.email,
			password: '',
			gas_station_id: moderator.stations?.length
				? moderator.stations[0].id
				: null,
		})
	}

	const resetForm = () => {
		setFormData({
			id: null,
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			gas_station_id: null,
		})
	}

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

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
								name='first_name'
								value={formData.first_name}
								onChange={handleInputChange}
								className='adminmoder-input'
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Last Name</label>
							<input
								type='text'
								name='last_name'
								value={formData.last_name}
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
								placeholder={formData.id ? 'Leave empty to keep current' : ''}
							/>
						</div>

						<div className='adminmoder-form-group'>
							<label className='adminmoder-label'>Gas Station</label>
							<select
								name='gas_station_id'
								value={formData.gas_station_id || ''}
								onChange={handleGasStationChange}
								className='adminmoder-select'
							>
								<option value=''>Select Gas Station</option>
								{gasStations.map(station => (
									<option key={station.id} value={station.id}>
										{station.name} - {station.address}
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
							{moderators.map(moderator => {
								const assignedStation = moderator.stations?.length
									? gasStations.find(s => s.id === moderator.stations[0].id)
									: null

								return (
									<div key={moderator.id} className='adminmoder-list-item'>
										<div className='adminmoder-list-info'>
											<span className='adminmoder-list-name'>
												{moderator.first_name} {moderator.last_name}
											</span>
											<span className='adminmoder-list-email'>
												{moderator.email}
											</span>
											{assignedStation && (
												<span className='adminmoder-list-station'>
													Station: {assignedStation.name} -{' '}
													{assignedStation.address}
												</span>
											)}
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
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AdminModer

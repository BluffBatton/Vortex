import React, { useState, useEffect } from 'react'
import './Moderator.css'
import {
	iconProfile,
	iconLogOut,
	iconMenu,
	iconLogo,
} from '../../Assets/Assets'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../api.js'

const ModeratorPage = () => {
	const navigate = useNavigate()
	const [user, setUser] = useState(null)
	const [station, setStation] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [fuelPrices, setFuelPrices] = useState([
		{ type: '92', price: '0', field: 'price92' },
		{ type: '95', price: '0', field: 'price95' },
		{ type: '100', price: '0', field: 'price100' },
		{ type: 'Diesel', price: '0', field: 'priceDiesel' },
		{ type: 'GAS', price: '0', field: 'priceGas' },
	])

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem('access')
			if (!token) {
				navigate('/LogIn')
				return
			}

			try {
				// Загрузка данных пользователя
				const userResponse = await fetch(`${API_BASE_URL}/api/user/profile/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!userResponse.ok) {
					navigate('/LogIn')
					return
				}

				const userData = await userResponse.json()
				setUser(userData)

				// Загрузка данных заправки
				const stationResponse = await fetch(
					`${API_BASE_URL}/api/gas-stations/my-stations/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)

				if (stationResponse.ok) {
					const stationData = await stationResponse.json()
					if (stationData.length > 0) {
						const moderatorStation = stationData[0]
						setStation(moderatorStation)

						setFuelPrices([
							{ type: '92', price: moderatorStation.price92, field: 'price92' },
							{ type: '95', price: moderatorStation.price95, field: 'price95' },
							{
								type: '100',
								price: moderatorStation.price100,
								field: 'price100',
							},
							{
								type: 'Diesel',
								price: moderatorStation.priceDiesel,
								field: 'priceDiesel',
							},
							{
								type: 'GAS',
								price: moderatorStation.priceGas,
								field: 'priceGas',
							},
						])
					}
				}
			} catch (err) {
				setError('Failed to fetch data')
				console.error('Error:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [navigate])

	const handlePriceChange = (index, newPrice) => {
		const updatedPrices = [...fuelPrices]
		updatedPrices[index].price = newPrice
		setFuelPrices(updatedPrices)
	}

	const handleSave = async () => {
		if (!station) return

		const token = localStorage.getItem('access')
		if (!token) {
			navigate('/LogIn')
			return
		}

		try {
			const updatedFields = {}
			fuelPrices.forEach(item => {
				updatedFields[item.field] = parseFloat(item.price) || 0
			})

			const response = await fetch(
				`${API_BASE_URL}/api/gas-stations/${station.id}/`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(updatedFields),
				}
			)

			if (response.ok) {
				const updatedStation = await response.json()
				setStation(updatedStation)
				alert('Prices updated successfully!')
			} else {
				throw new Error('Failed to update prices')
			}
		} catch (err) {
			console.error('Error updating prices:', err)
			alert('Failed to update prices')
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('access')
		localStorage.removeItem('refresh')
		navigate('/')
	}

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	return (
		<main className='moderator-main'>
			<div className='moderator-sidebar'>
				<div className='moderator-logo-block'>
					<img
						src={iconLogo}
						alt='Vortex Logo'
						className='moderator-logo-image'
					/>
					<div className='moderator-logo-text'>Vortex</div>
				</div>
				<div className='moderator-side-divider-wrapper'>
					<hr className='moderator-side-divider' />
				</div>
				<div className='moderator-panel-title'>Moderator panel</div>
				<div className='moderator-user-block'>
					<img
						src={iconProfile}
						alt='User Avatar'
						className='moderator-user-avatar'
					/>
					<div className='moderator-user-name'>
						{user ? `${user.first_name} ${user.last_name}` : 'Moderator'}
					</div>
					<button className='moderator-logout' onClick={handleLogout}>
						<img
							src={iconLogOut}
							alt='Logout'
							className='moderator-logout-icon'
						/>
						Log out
					</button>
				</div>

				<div className='moderator-nav-item-wrapper'>
					<div className='moderator-nav-item'>
						<img src={iconMenu} alt='Price' className='moderator-nav-icon' />
						<span className='moderator-nav-text'>Price change</span>
					</div>
				</div>
			</div>

			<div className='moderator-content'>
				<h2 className='moderator-title'>Price Management</h2>
				<hr className='moderator-divider' />

				{station && (
					<>
						<div className='moderator-station-block'>
							<div className='moderator-station-group'>
								<label className='moderator-station-label'>Station</label>
								<input
									type='text'
									value={`${station.name} | ${station.address}`}
									readOnly
									className='moderator-station-input'
								/>
							</div>
						</div>

						<div className='moderator-table-block'>
							<h3 className='moderator-table-title'>Fuel Prices</h3>
							<table className='moderator-table'>
								<thead>
									<tr className='moderator-table-header-row'>
										<th className='moderator-table-header-cell'>Type of gas</th>
										<th className='moderator-table-header-cell'>Price (₴)</th>
									</tr>
								</thead>
								<tbody>
									{fuelPrices.map((item, index) => (
										<tr key={index} className='moderator-table-row'>
											<td className='moderator-table-cell'>A-{item.type}</td>
											<td className='moderator-table-cell'>
												<input
													type='number'
													value={item.price}
													onChange={e =>
														handlePriceChange(index, e.target.value)
													}
													className='moderator-price-input'
													step='0.01'
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className='moderator-save-wrapper'>
							<button className='moderator-save-button' onClick={handleSave}>
								Save Changes
							</button>
						</div>
					</>
				)}
			</div>
		</main>
	)
}

export default ModeratorPage

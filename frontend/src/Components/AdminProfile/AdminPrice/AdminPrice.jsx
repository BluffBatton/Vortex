import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../../../api'
import './AdminPrice.css'

const AdminPrice = () => {
	const [stations, setStations] = useState([])
	const [selectedStationId, setSelectedStationId] = useState(null)
	const [prices, setPrices] = useState({})

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/api/gas-stations/`)
			.then(res => setStations(res.data))
			.catch(err => console.error(err))
	}, [])

	useEffect(() => {
		if (selectedStationId) {
			const station = stations.find(s => s.id === selectedStationId)
			if (station) {
				setPrices({
					price92: station.price92,
					price95: station.price95,
					price100: station.price100,
					priceGas: station.priceGas,
					priceDiesel: station.priceDiesel,
				})
			}
		}
	}, [selectedStationId, stations])

	const handlePriceChange = e => {
		const { name, value } = e.target
		setPrices(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		if (!selectedStationId) return
		axios
			.patch(`${API_BASE_URL}/api/gas-stations/${selectedStationId}/`, prices)
			.then(() => alert('Prices saved'))
			.catch(err => console.error(err))
	}

	return (
		<main className='adminprice-main'>
			<div className='adminprice-content'>
				<h2 className='adminprice-title'>Price Management</h2>
				<hr className='adminprice-divider' />

				<div className='adminprice-station-block'>
					<div className='adminprice-station-group'>
						<label className='adminprice-station-label'>Station</label>
						<select
							className='adminprice-station-input'
							onChange={e => setSelectedStationId(Number(e.target.value))}
							defaultValue=''
						>
							<option value='' disabled>
								-- Select a station --
							</option>
							{stations.map(station => (
								<option key={station.id} value={station.id}>
									{station.name}
								</option>
							))}
						</select>
					</div>
				</div>

				{selectedStationId && (
					<div className='adminprice-table-block'>
						<h3 className='adminprice-table-title'>Fuel Prices</h3>
						<table className='adminprice-table'>
							<thead>
								<tr className='adminprice-table-header-row'>
									<th className='adminprice-table-header-cell'>Type of gas</th>
									<th className='adminprice-table-header-cell'>Price (₴)</th>
								</tr>
							</thead>
							<tbody>
								{[
									{ name: 'price92', label: 'A-92' },
									{ name: 'price95', label: 'A-95' },
									{ name: 'price100', label: 'A-100' },
									{ name: 'priceGas', label: 'Gas' },
									{ name: 'priceDiesel', label: 'Diesel' },
								].map(({ name, label }) => (
									<tr key={name} className='adminprice-table-row'>
										<td className='adminprice-table-cell'>{label}</td>
										<td className='adminprice-table-cell'>
											<input
												type='number'
												className='adminprice-price-input'
												name={name}
												value={prices[name] || ''}
												onChange={handlePriceChange}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				<div className='adminprice-save-wrapper'>
					<button className='adminprice-save-button' onClick={handleSave}>
						Save Changes
					</button>
				</div>
			</div>
		</main>
	)
}

export default AdminPrice

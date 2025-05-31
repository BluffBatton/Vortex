import React, { useEffect, useState } from 'react'
import './AdminPrice.css'

const AdminPrice = () => {
	const [stations] = useState([
		'#1 | Kyivska street, 10',
		'#2 | Kharkivska street, 2A',
		'#3 | Lvivska street, 45',
	])

	const [selectedStation, setSelectedStation] = useState(stations[0])
	const [fuelTypes, setFuelTypes] = useState([])

	useEffect(() => {
		const mockPricesByStation = {
			'#1 | Kyivska street, 10': [
				{ type: 'A-100', price: '66.99 ₴' },
				{ type: 'A-95', price: '54.00 ₴' },
				{ type: 'Diesel', price: '51.00 ₴' },
			],
			'#2 | Kharkivska street, 2A': [
				{ type: 'A-100', price: '67.99 ₴' },
				{ type: 'A-95', price: '55.00 ₴' },
				{ type: 'Diesel', price: '52.00 ₴' },
			],
			'#3 | Lvivska street, 45': [
				{ type: 'A-100', price: '65.99 ₴' },
				{ type: 'A-95', price: '53.00 ₴' },
				{ type: 'Diesel', price: '50.00 ₴' },
			],
		}

		const fetchedPrices = mockPricesByStation[selectedStation] || []
		setFuelTypes(fetchedPrices)
	}, [selectedStation])

	const handlePriceChange = (index, newPrice) => {
		const updated = [...fuelTypes]
		updated[index].price = newPrice
		setFuelTypes(updated)
	}

	const handleSave = () => {
		console.log('Saving prices for', selectedStation)
		console.log(fuelTypes)
		alert('Prices saved (mock)')
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
							value={selectedStation}
							onChange={e => setSelectedStation(e.target.value)}
							className='adminprice-station-input'
						>
							{stations.map((station, idx) => (
								<option key={idx} value={station}>
									{station}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className='adminprice-table-block'>
					<h3 className='adminprice-table-title'>Fuel Prices</h3>
					<table className='adminprice-table'>
						<thead>
							<tr className='adminprice-table-header-row'>
								<th className='adminprice-table-header-cell'>Type of gas</th>
								<th className='adminprice-table-header-cell'>Price</th>
							</tr>
						</thead>
						<tbody>
							{fuelTypes.map((item, index) => (
								<tr key={index} className='adminprice-table-row'>
									<td className='adminprice-table-cell'>{item.type}</td>
									<td className='adminprice-table-cell'>
										<input
											type='text'
											value={item.price}
											onChange={e => handlePriceChange(index, e.target.value)}
											className='adminprice-price-input'
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

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

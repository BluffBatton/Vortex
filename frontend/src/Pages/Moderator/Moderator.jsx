import React, { useState } from 'react'
import './Moderator.css'
import {
	iconProfile,
	iconLogOut,
	iconMenu,
	iconLogo,
} from '../../Assets/Assets'

const ModeratorPage = () => {
	const userName = 'Jonis Barabulka'
	const station = '#2 | Kharkivska street, 2A, Chuguiv, Kharkiv region, Ukraine'

	const [fuelTypes, setFuelTypes] = useState([
		{ type: 'A-100', price: '67.99 ₴' },
		{ type: 'A-95', price: '54.29 ₴' },
		{ type: 'A-92', price: '52.02 ₴' },
		{ type: 'Diesel Fuel', price: '52.36 ₴' },
		{ type: 'GAS', price: '34.72 ₴' },
	])

	const handlePriceChange = (index, newPrice) => {
		const updatedFuelTypes = [...fuelTypes]
		updatedFuelTypes[index].price = newPrice
		setFuelTypes(updatedFuelTypes)
	}

	const handleSave = () => {
		console.log('Saving updated prices (mock):', fuelTypes)
		alert('Prices saved (mock)')
	}

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
					<div className='moderator-user-name'>{userName}</div>
					<button className='moderator-logout'>
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

				<div className='moderator-station-block'>
					<div className='moderator-station-group'>
						<label className='moderator-station-label'>Station</label>
						<input
							type='text'
							value={station}
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
								<th className='moderator-table-header-cell'>Price</th>
							</tr>
						</thead>
						<tbody>
							{fuelTypes.map((item, index) => (
								<tr key={index} className='moderator-table-row'>
									<td className='moderator-table-cell'>{item.type}</td>
									<td className='moderator-table-cell'>
										<input
											type='text'
											value={item.price}
											onChange={e => handlePriceChange(index, e.target.value)}
											className='moderator-price-input'
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
			</div>
		</main>
	)
}

export default ModeratorPage

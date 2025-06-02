import React, { useState, useEffect } from 'react'
import './List.css'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../../api.js'

import {
	Phone,
	iconAchieve,
	iconCard,
	iconStation,
} from '../../../Assets/Assets.js'

const List = () => {
	const [locations, setLocations] = useState([])

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/gas-stations/`)
			.then(res => res.json())
			.then(data => setLocations(data))
			.catch(error => console.error('Failed to load locations:', error))
	}, [])

	return (
		<main className='list_main'>
			<section className='list-network-map'>
				<h2 className='list-network-map__title'>NETWORK MAP</h2>
				<nav className='list-network-map__nav'>
					<Link to='/Map' className='list-network-map__link'>
						Map
					</Link>
					<Link
						to='/List'
						className='list-network-map__link list-network-map__link--active'
					>
						List of gas stations
					</Link>
				</nav>

				<ul className='list-network-map__stations'>
					{locations.map((loc, index) => (
						<li key={index}>
							<strong>{loc.name}</strong>
							<br />
							{loc.address}
						</li>
					))}
				</ul>
			</section>

			<section className='list__app'>
				<div className='list__app-container'>
					<div className='list__app-image'>
						<img src={Phone} alt='QR code' />
					</div>
					<div className='list__app-content'>
						<h2 className='list__section-title'>Install our app</h2>
						<p className='list__app-description'>
							Install our app to fully enjoy our ecosystem
						</p>
						<ul className='list__app-features'>
							<li className='list__app-feature'>
								<img src={iconCard} alt='icon' />
								<span>Manage your fuel in your phone: buy it, spend it</span>
							</li>
							<li className='list__app-feature'>
								<img src={iconStation} alt='icon' />
								<span>
									Find our stations using interactive map with prices on each
									station
								</span>
							</li>
							<li className='list__app-feature'>
								<img src={iconAchieve} alt='icon' />
								<span>Gain achievements spending money and buying fuel</span>
							</li>
						</ul>
						<a
							href='downloads/vortex_app.apk'
							className='list__app-button'
							download
						>
							Download app here
						</a>
					</div>
				</div>
			</section>
		</main>
	)
}

export default List

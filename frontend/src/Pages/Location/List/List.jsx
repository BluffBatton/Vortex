import React, { useState, useEffect } from 'react'
import './List.css'
import { Link } from 'react-router-dom'

import {
	Phone,
	iconAchieve,
	iconCard,
	iconStation,
} from '../../../Assets/Assets.js'

const locationsMock = [
	{ city: 'Lviv', address: '123 Stryiska Street, Lviv, Lviv Oblast, Ukraine' },
	{
		city: 'Kharkiv',
		address: '45 Heroiv Pratsi Avenue, Kharkiv, Kharkiv Oblast, Ukraine',
	},
	{
		city: 'Dnipro',
		address: '77 Yavornytskogo Avenue, Dnipro, Dnipropetrovsk Oblast, Ukraine',
	},
	{
		city: 'Zaporizhzhia',
		address: '10 Sobornyi Avenue, Zaporizhzhia, Zaporizhzhia Oblast, Ukraine',
	},
	{
		city: 'Mykolaiv',
		address: '34 Central Avenue, Mykolaiv, Mykolaiv Oblast, Ukraine',
	},
	{
		city: 'Kropyvnytskyi',
		address:
			'8 Velyka Perspektvyna Street, Kropyvnytskyi, Kirovohrad Oblast, Ukraine',
	},
	{
		city: 'Vinnytsia',
		address: '21 Kyivska Street, Vinnytsia, Vinnytsia Oblast, Ukraine',
	},
	{
		city: 'Zhytomyr',
		address: '16 Peremohy Avenue, Zhytomyr, Zhytomyr Oblast, Ukraine',
	},
	{
		city: 'Poltava',
		address: '99 Sobornosti Street, Poltava, Poltava Oblast, Ukraine',
	},
	{
		city: 'Cherkasy',
		address: '5 Smilianska Street, Cherkasy, Cherkasy Oblast, Ukraine',
	},
	{ city: 'Sumy', address: '12 Kharkivska Street, Sumy, Sumy Oblast, Ukraine' },
	{
		city: 'Ternopil',
		address: '25 Ruska Street, Ternopil, Ternopil Oblast, Ukraine',
	},
	{
		city: 'Khmelnytskyi',
		address:
			'18 Kamianetska Street, Khmelnytskyi, Khmelnytskyi Oblast, Ukraine',
	},
]

const List = () => {
	const [locations, setLocations] = useState([])

	useEffect(() => {
		setLocations(locationsMock)
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
							<strong>{loc.city}</strong>
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

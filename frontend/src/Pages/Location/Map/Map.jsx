import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import './Map.css'
import { Link } from 'react-router-dom'

import {
	Phone,
	iconAchieve,
	iconCard,
	iconStation,
} from '../../../Assets/Assets.js'

const stations = [
	{ name: 'Kyiv', lat: 50.4501, lng: 30.5234 },
	{ name: 'Lviv', lat: 49.8397, lng: 24.0297 },
	{ name: 'Odesa', lat: 46.4825, lng: 30.7233 },
	{ name: 'Dnipro', lat: 48.4647, lng: 35.0462 },
	{ name: 'Kharkiv', lat: 49.9935, lng: 36.2304 },
]

const containerStyle = {
	width: '100%',
	height: '500px',
}

const center = stations[0] // center of map on first station

const Map = () => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyC5D4Eeb95fRyUciLIDLpWhrW2sEfjpm8Y',
	})

	return (
		<main className='map_main'>
			<section className='network-map'>
				<h2 className='network-map__title'>NETWORK MAP</h2>
				<nav className='network-map__nav'>
					<Link
						to='/Map'
						className='network-map__link network-map__link--active'
					>
						Map
					</Link>
					<Link to='/List' className='network-map__link'>
						List of gas stations
					</Link>
				</nav>
			</section>

			<div className='map-container'>
				{isLoaded ? (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={6}
					>
						{stations.map((station, i) => (
							<Marker
								key={i}
								position={{ lat: station.lat, lng: station.lng }}
								title={station.name}
							/>
						))}
					</GoogleMap>
				) : (
					<p>Loading map...</p>
				)}
			</div>

			<section className='network__app'>
				<div className='network__app-container'>
					<div className='network__app-image'>
						<img src={Phone} alt='QR code' />
					</div>
					<div className='network__app-content'>
						<h2 className='network__section-title'>Install our app</h2>
						<p className='network__app-description'>
							Install our app to fully enjoy our ecosystem
						</p>
						<ul className='network__app-features'>
							<li className='network__app-feature'>
								<img src={iconCard} alt='icon' />
								<span>Manage your fuel in your phone: buy it, spend it</span>
							</li>
							<li className='network__app-feature'>
								<img src={iconStation} alt='icon' />
								<span>
									Find our stations using interactive map with prices on each
									station
								</span>
							</li>
							<li className='network__app-feature'>
								<img src={iconAchieve} alt='icon' />
								<span>Gain achievements spending money and buying fuel</span>
							</li>
						</ul>
						<a
							href='downloads/vortex_app.apk'
							className='network__app-button'
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

export default Map

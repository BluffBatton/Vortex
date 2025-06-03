import React, { useState, useEffect } from 'react'
import {
	GoogleMap,
	Marker,
	InfoWindow,
	useJsApiLoader,
} from '@react-google-maps/api'
import './Map.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../../api.js'
import { OverlayView } from '@react-google-maps/api'

import {
	Phone,
	iconAchieve,
	iconCard,
	iconStation,
} from '../../../Assets/Assets.js'

const containerStyle = {
	width: '100%',
	height: '500px',
}

const Map = () => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyC5D4Eeb95fRyUciLIDLpWhrW2sEfjpm8Y',
	})

	const [stations, setStations] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [selectedStation, setSelectedStation] = useState(null)

	useEffect(() => {
		const fetchStations = async () => {
			try {
				const response = await axios.get(`${API_BASE_URL}/api/gas-stations/`)
				setStations(
					response.data.map(station => ({
						id: station.id,
						name: station.name,
						lat: parseFloat(station.latitude),
						lng: parseFloat(station.longitude),
						address: station.address,
						price92: station.price92,
						price95: station.price95,
						price100: station.price100,
						priceGas: station.priceGas,
						priceDiesel: station.priceDiesel,
					}))
				)
				setLoading(false)
			} catch (err) {
				console.error('Error fetching gas stations:', err)
				setError('Failed to load gas stations data')
				setLoading(false)
			}
		}

		fetchStations()
	}, [])

	const center =
		stations.length > 0
			? { lat: stations[0].lat, lng: stations[0].lng }
			: { lat: 50.4501, lng: 30.5234 }

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
				{loading ? (
					<p>Loading stations data...</p>
				) : error ? (
					<p className='error-message'>{error}</p>
				) : isLoaded ? (
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={stations.length > 0 ? 7 : 5}
					>
						{stations.map(station => (
							<React.Fragment key={station.id}>
								<Marker
									position={{ lat: station.lat, lng: station.lng }}
									title={`${station.name} (${station.address})`}
									onClick={() => setSelectedStation(station)}
								/>

								<OverlayView
									position={{ lat: station.lat, lng: station.lng }}
									mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
								>
									<div className='station-label'>{station.name}</div>
								</OverlayView>
							</React.Fragment>
						))}

						{selectedStation && (
							<InfoWindow
								position={{
									lat: selectedStation.lat,
									lng: selectedStation.lng,
								}}
								onCloseClick={() => setSelectedStation(null)}
							>
								<div className='station-info'>
									<h3>{selectedStation.name}</h3>
									<p>{selectedStation.address}</p>
									<ul>
										<li>92: {selectedStation.price92} ₴</li>
										<li>95: {selectedStation.price95} ₴</li>
										<li>100: {selectedStation.price100} ₴</li>
										<li>Gas: {selectedStation.priceGas} ₴</li>
										<li>Diesel: {selectedStation.priceDiesel} ₴</li>
									</ul>
								</div>
							</InfoWindow>
						)}
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

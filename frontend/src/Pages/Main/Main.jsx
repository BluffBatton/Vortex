import React, { useState, useEffect } from 'react'
import './Main.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../../api.js'

import {
	Slide1,
	Slide2,
	Slide3,
	Cafe1,
	Cafe3,
	Phone,
	iconAchieve,
	iconCard,
	iconStation,
} from '../../Assets/Assets'

const slides = [
	{ src: Slide1, alt: 'Slide 1' },
	{ src: Slide2, alt: 'Slide 2' },
	{ src: Slide3, alt: 'Slide 3' },
]

const Main = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [autoSlideInterval, setAutoSlideInterval] = useState(null)
	const [fuelPrices, setFuelPrices] = useState({
		92: '—',
		95: '—',
		100: '—',
		GAS: '—',
		DF: '—',
	})

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/api/global-fuel-prices/`)
			.then(response => {
				const prices = {}
				response.data.forEach(item => {
					if (item.name.toLowerCase() === '92') prices['92'] = item.price
					if (item.name.toLowerCase() === '95') prices['95'] = item.price
					if (item.name.toLowerCase() === '100') prices['100'] = item.price
					if (item.name.toLowerCase() === 'gas') prices['GAS'] = item.price
					if (item.name.toLowerCase() === 'diesel') prices['DF'] = item.price
				})
				setFuelPrices(prices)
			})
			.catch(error => {
				console.error('Ошибка загрузки цен на топливо:', error)
			})
	}, [])

	const showSlide = index => {
		setCurrentIndex(index)
		resetAutoSlide()
	}

	const prevSlide = () => {
		const newIndex = (currentIndex - 1 + slides.length) % slides.length
		setCurrentIndex(newIndex)
		resetAutoSlide()
	}

	const nextSlide = () => {
		const newIndex = (currentIndex + 1) % slides.length
		setCurrentIndex(newIndex)
		resetAutoSlide()
	}

	const startAutoSlide = () => {
		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % slides.length)
		}, 5000)
		setAutoSlideInterval(interval)
	}

	const resetAutoSlide = () => {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval)
		}
		startAutoSlide()
	}

	useEffect(() => {
		startAutoSlide()
		return () => clearInterval(autoSlideInterval)
	}, [])

	const fuelsToDisplay = [
		{ type: '92', price: fuelPrices['92'] },
		{ type: '95', price: fuelPrices['95'] },
		{ type: '100', price: fuelPrices['100'] },
		{ type: 'GAS', price: fuelPrices['GAS'] },
		{ type: 'DF', price: fuelPrices['DF'] },
	]

	return (
		<main className='main'>
			<section className='main__slider'>
				<div className='main__slider-container'>
					{slides.map((slide, index) => (
						<div
							key={index}
							className={`main__slide ${
								index === currentIndex ? 'main__slide-active' : ''
							}`}
						>
							<img src={slide.src} alt={slide.alt} />
						</div>
					))}

					<button
						className='main__slider-arrow main__slider-arrow-left'
						onClick={prevSlide}
					>
						&lt;
					</button>
					<button
						className='main__slider-arrow main__slider-arrow-right'
						onClick={nextSlide}
					>
						&gt;
					</button>

					<div className='main__slider-dots'>
						{slides.map((_, index) => (
							<span
								key={index}
								className={`main__slider-dot ${
									index === currentIndex ? 'main__slider-dot-active' : ''
								}`}
								onClick={() => showSlide(index)}
							></span>
						))}
					</div>
				</div>
			</section>

			<section className='main__fuel-prices'>
				<h2 className='main__section-title'>Actual fuel prices</h2>
				<div className='main__fuel-types'>
					{fuelsToDisplay.map((fuel, index) => (
						<div className='main__fuel-type' key={index}>
							<span className='main__fuel-name'>{fuel.type}</span>
							<span className='main__fuel-price'>
								{typeof fuel.price === 'number'
									? fuel.price.toFixed(2)
									: fuel.price}{' '}
								₴
							</span>
						</div>
					))}
				</div>
				<p className='main__fuel-note'>
					*Keep in mind that prices can be different from station to station
				</p>
				<Link to='/Fuel' className='main__fuel-button'>
					See more
				</Link>
			</section>

			<section className='main__cafe'>
				<h2 className='main__section-title'>
					Enjoy our high-calorie food at our cafe
				</h2>

				<div className='main__cafe-row'>
					<img src={Cafe1} alt='Donut' className='main__cafe-image' />
					<div className='main__cafe-text'>
						<p>
							Our cafe offers a variety of different dishes: donuts, hot dogs,
							burgers, and we are not even talking about candy bars, chips etc.
						</p>
					</div>
				</div>

				<div className='main__cafe-row'>
					<div className='main__cafe-text'>
						<p>
							Also you can buy different types of coffee, such as Latte,
							Americano, Cappuccino, Espresso, Mocha. If that's not enough for
							you, we can suggest soda, cold tea and lots more.
						</p>
						<Link to='/Cafe' className='main__cafe-button'>
							Read more about cafe →
						</Link>
					</div>
					<img src={Cafe3} alt='Coffee' className='main__cafe-image' />
				</div>
			</section>

			<section className='main__app'>
				<div className='main__app-container'>
					<div className='main__app-image'>
						<img src={Phone} alt='QR code' />
					</div>
					<div className='main__app-content'>
						<h2 className='main__section-title'>Install our app</h2>
						<p className='main__app-description'>
							Install our app to fully enjoy our ecosystem
						</p>
						<ul className='main__app-features'>
							<li className='main__app-feature'>
								<img src={iconCard} alt='icon' />
								<span>Manage your fuel in your phone: buy it, spend it</span>
							</li>
							<li className='main__app-feature'>
								<img src={iconStation} alt='icon' />
								<span>
									Find our stations using interactive map with prices on each
									station
								</span>
							</li>
							<li className='main__app-feature'>
								<img src={iconAchieve} alt='icon' />
								<span>Gain achievements spending money and buying fuel</span>
							</li>
						</ul>
						<a
							href='downloads/vortex_app.apk'
							className='main__app-button'
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

export default Main

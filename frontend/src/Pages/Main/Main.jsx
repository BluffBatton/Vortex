import React, { useState, useEffect } from 'react'
import './Main.css'
import { Link } from 'react-router-dom'

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
	const [fuelPrices, setFuelPrices] = useState([
		{ type: '92', price: 50.99 },
		{ type: '95', price: 54.99 },
		{ type: '100', price: 57.99 },
		{ type: 'GAS', price: 33.0 },
		{ type: 'DF', price: 48.99 },
	])

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
					{fuelPrices.map((fuel, index) => (
						<div className='main__fuel-type' key={index}>
							<span className='main__fuel-name'>{fuel.type}</span>
							<span className='main__fuel-price'>{fuel.price.toFixed(2)}</span>
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

			<section class='main__cafe'>
				<h2 class='main__section-title'>
					Enjoy our high-calorie food at our cafe
				</h2>

				<div class='main__cafe-row'>
					<img src={Cafe1} alt='Donut' class='main__cafe-image' />
					<div class='main__cafe-text'>
						<p>
							Our cafe offers a variety of different dishes: donuts, hot dogs,
							burgers, and we are not even talking about candy bars, chips etc.
						</p>
					</div>
				</div>

				<div class='main__cafe-row'>
					<div class='main__cafe-text'>
						<p>
							Also you can buy different types of coffee, such as Latte,
							Americano, Cappuccino, Espresso, Mocha. If that's not enough for
							you, we can suggest soda, cold tea and lots more.
						</p>
						<Link to='/Cafe' class='main__cafe-button'>
							Read more about cafe →
						</Link>
					</div>
					<img src={Cafe3} alt='Coffee' class='main__cafe-image' />
				</div>
			</section>

			<section class='main__app'>
				<div class='main__app-container'>
					<div class='main__app-image'>
						<img src={Phone} alt='QR code' />
					</div>
					<div class='main__app-content'>
						<h2 class='main__section-title'>Install our app</h2>
						<p class='main__app-description'>
							Install our app to fully enjoy our ecosystem
						</p>
						<ul class='main__app-features'>
							<li class='main__app-feature'>
								<img src={iconCard} alt='icon' />
								<span>Manage your fuel in your phone: buy it, spend it</span>
							</li>
							<li class='main__app-feature'>
								<img src={iconStation} alt='icon' />
								<span>
									Find our stations using interactive map with prices on each
									station
								</span>
							</li>
							<li class='main__app-feature'>
								<img src={iconAchieve} alt='icon' />
								<span>Gain achievements spending money and buying fuel</span>
							</li>
						</ul>
						<a
							href='downloads/vortex_app.apk'
							class='main__app-button'
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

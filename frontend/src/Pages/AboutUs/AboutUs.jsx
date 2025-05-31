import React from 'react'
import './AboutUs.css'

import { Flags, Sanya } from '../../Assets/Assets.js'

const AboutUs = () => {
	return (
		<main class='aboutus-main'>
			<div class='aboutus-block1'>
				<div class='aboutus-text-container'>
					<h2 class='aboutus-title'>Driven by Quality,</h2>
				</div>
				<div class='aboutus-text-container-right'>
					<h2 class='aboutus-title'>Powered by Trust.</h2>
				</div>
				<div class='aboutus-images-container'>
					<img
						src={Flags}
						alt='Фото слева'
						class='aboutus-image aboutus-image-left'
					/>
					<img
						src={Sanya}
						alt='Фото справа'
						class='aboutus-image aboutus-image-right'
					/>
				</div>
			</div>

			<div class='aboutus-block2'>
				<div class='aboutus-content-overlay'>
					<h2 class='aboutus-main-title'>Clean. Reliable.</h2>
					<h2 class='aboutus-main-title-underscore'>Ready to Go.</h2>
					<p class='aboutus-text aboutus-text-left'>
						VORTEX is a cutting-edge Ukrainian fuel station network that sets
						new standards in reliability, innovation, and customer service.
						Designed for the modern driver, it combines advanced technology with
						efficient operations to deliver a seamless refueling experience. The
						brand has rapidly gained recognition in Ukraine’s competitive market
						thanks to its strategic expansion and commitment to quality.
					</p>
					<p class='aboutus-text aboutus-text-right'>
						What truly sets VORTEX apart is its uncompromising commitment to
						service excellence. Each visit is tailored to the customer—from
						intuitive digital payment systems to meticulously maintained
						facilities that prioritize cleanliness and safety. This
						customer-first philosophy extends to every touchpoint, ensuring a
						seamless, almost premium retail experience rarely associated with
						traditional fuel stops.
					</p>
					<p class='aboutus-text aboutus-text-left'>
						At VORTEX, every detail matters — from the sleek architecture of our
						stations to the carefully curated service experience. We don’t just
						sell fuel; we create a space where drivers can recharge, relax, and
						rely on consistent excellence. With a vision focused on progress,
						VORTEX continues to expand its presence, driving forward the future
						of mobility in Ukraine.
					</p>
				</div>
			</div>
		</main>
	)
}

export default AboutUs

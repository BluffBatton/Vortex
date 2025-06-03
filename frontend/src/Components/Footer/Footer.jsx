import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom'

import {
	iconLogo,
	iconGmail,
	iconInst,
	iconLink,
	iconLocation,
	iconPhone,
	iconX,
} from '../../Assets/Assets.js'

const Footer = () => {
	return (
		<footer class='footer'>
			<div class='footer__column footer__left'>
				<h3>Contact info</h3>
				<ul class='footer__contact-list'>
					<li>
						<img src={iconLocation} alt='Location' /> 53 Olzhycha Street, Kyiv,
						02000
					</li>
					<li>
						<img src={iconGmail} alt='Email' />
						vortex.ua@gmail.com
					</li>
					<li>
						<img src={iconPhone} alt='Phone' /> +38 066 187 53 60
					</li>
				</ul>
			</div>

			<div class='footer__column footer__center'>
				<Link to='/' class='footer__logo-link'>
					<img src={iconLogo} alt='Vortex Logo' class='footer__logo' />
					<div class='footer__name'>Vortex</div>
				</Link>
				<div class='footer__socials'>
					<a
						href='https://www.linkedin.com/in/vortex-company'
						target='_blank'
						rel='noopener noreferrer'
					>
						<img src={iconLink} alt='LinkedIn' />
					</a>
					<a
						href='https://www.instagram.com/1_vortex1/'
						target='_blank'
						rel='noopener noreferrer'
					>
						<img src={iconInst} alt='Instagram' />
					</a>
					<a
						href='https://x.com/1_Vortex1'
						target='_blank'
						rel='noopener noreferrer'
					>
						<img src={iconX} alt='X' />
					</a>
				</div>
			</div>

			<div class='footer__column footer__right'>
				<div class='footer__brand'>Vortex™</div>
				<ul class='footer__nav'>
					<li>
						<Link to='/AboutUs'>
							About Us <span>&lt;</span>
						</Link>
					</li>
					<li>
						<Link to='/Fuel'>
							Fuel prices <span>&lt;</span>
						</Link>
					</li>
					<li>
						<Link to='/Cafe'>
							Cafe <span>&lt;</span>
						</Link>
					</li>
					<li>
						<Link to='/Map'>
							Stations map <span>&lt;</span>
						</Link>
					</li>
				</ul>
			</div>
		</footer>
	)
}

export default Footer

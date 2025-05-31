import React from 'react'
import './Header.css' // обычный CSS
import { Link } from 'react-router-dom'

import { iconLogo, iconLogin } from '../../Assets/Assets.js'

const Header = () => {
	return (
		<header class='header'>
			<nav class='header__nav'>
				<ul class='header__menu'>
					<li>
						<Link to='/AboutUs' class='header__link'>
							ABOUT US
						</Link>
					</li>
					<li>
						<Link to='/Fuel' class='header__link'>
							FUEL PRICES
						</Link>
					</li>
				</ul>

				<div class='header__logo-block'>
					<Link to='/' class='header__logo-link'>
						<img src={iconLogo} alt='Vortex Logo' class='header__logo' />
						<div class='header__name'>Vortex</div>
					</Link>
				</div>

				<ul class='header__menu'>
					<li>
						<Link to='/Cafe' class='header__link'>
							CAFE
						</Link>
					</li>
					<li>
						<Link to='/Map' class='header__link'>
							STATION MAP
						</Link>
					</li>
				</ul>

				<div class='header__auth'>
					<Link to='/Authorization' class='header__signin'>
						<img src={iconLogin} alt='User Icon' class='header__user-icon' />
						Sign In
					</Link>
				</div>
			</nav>
		</header>
	)
}

export default Header

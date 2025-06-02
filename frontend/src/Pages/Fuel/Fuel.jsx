import React, { useEffect, useState } from 'react'
import './Fuel.css'
import { Euro, EuroD, Gas, Mustang } from '../../Assets/Assets.js'
import axios from 'axios'
import { API_BASE_URL } from '../../api.js'

const Fuel = () => {
	const [activeModal, setActiveModal] = useState(null)
	const [fuelPrices, setFuelPrices] = useState({})

	useEffect(() => {
		axios
			.get(`${API_BASE_URL}/api/global-fuel-prices/`)
			.then(response => {
				const priceMap = {}
				response.data.forEach(item => {
					priceMap[item.name.toLowerCase()] = item.price
				})
				setFuelPrices(priceMap)
			})
			.catch(error => {
				console.error('Ошибка загрузки цен на топливо:', error)
			})
	}, [])

	const openModal = type => setActiveModal(type)
	const closeModal = () => setActiveModal(null)

	const fuels = [
		{
			type: '100',
			name: 'Mustang',
			price: fuelPrices['100'] || '—',
			modalId: 'fuelModal100',
			img: Mustang,
			title: '100 Mustang',
			description: `Automobile gasoline Mustang100 A-98-Euro5-E10: octane number not lower than A-98, complies with Euro-5 standards (sulfur ≤10 mg/kg).`,
			technology: `Automobile gasoline Mustang 100 is produced from a base gasoline of no lower than grade A-98  
    or Unleaded Gasoline 100, with the addition of a multifunctional detergent additive package—  
    Pachem B200, manufactured by the chemical group Pachem—at a concentration of 0.01 L/m³.  
    This gasoline offers excellent performance benefits, including maintaining cleanliness and  
    providing cleaning action throughout the entire fuel injection system. By reducing and  
    controlling deposit formation in injector nozzles, carburetors, and intake valves, it enhances  
    vehicle drivability, improves fuel economy, restores engine power, and reduces exhaust  
    emissions.`,
		},
		{
			type: '95',
			name: 'Mustang',
			price: fuelPrices['95'] || '—',
			modalId: 'fuelModal95',
			img: Mustang,
			title: '95 Mustang',
			description: `Gasoline automobile Mustang A-95-Cvro5-YeO`,
			technology: `Automobile gasoline Mustang 95 is made of base gasoline grade A-95 standard €vro-5 with the addition of a package of multifunctional detergent additive chemical concern Pachem B200 0.01l/m3. Gasoline provides excellent performance advantages, including maintaining cleanliness and cleaning the entire injection system. By reducing and controlling the formation of deposits in the nozzles of injectors, carburetors and intake valves, the controllability of the car is improved, fuel economy is increased, engine power is restored and the concentration of exhaust emissions is reduced.`,
		},
		{
			type: '92',
			name: 'Euro5',
			price: fuelPrices['92'] || '—',
			modalId: 'fuelModal92',
			img: Euro,
			title: '92 Euro5',
			description: `Gasoline automobile Mustang A-92-Cvro5-YeO`,
			technology: `Automobile gasoline Mustang 92 is made of base gasoline grade A-92 standard Cvro-5 with the addition of a package of multifunctional detergent additive chemical concern Pachem B200 0.01l/m3. Gasoline provides excellent performance advantages, including maintaining cleanliness and cleaning the entire injection system. By reducing and controlling the formation of deposits in the nozzles of injectors, carburetors and intake valves, the controllability of the car is improved, fuel economy is increased, engine power is restored and the concentration of exhaust emissions is reduced.`,
		},
		{
			type: 'diesel',
			name: 'Euro5',
			price: fuelPrices['diesel'] || '—',
			modalId: 'fuelModalDiesel',
			img: EuroD,
			title: 'Diesel Euro5',
			description: `Depending on climatic conditions, fuel is summer (DP-L-Euro5-VO) or winter (DP-Z-Euro5-BO). According to the level of environmental safety corresponds to the class of Euro-5 with a sulfur content of not more than 10 mg/kg (ppm).`,
			technology: `DP Euro-5 meets the requirements of DSTU 7688:2015 "DIESEL EURO FUEL. Technical Specifications," Technical Regulations on Requirements for Motor Gasolines, Diesel, Marine and Boiler Fuels and European Standard EN 590" Automotive fuels - Diesel - Requirements and test methods."`,
		},
		{
			type: 'gas',
			name: 'Galati',
			price: fuelPrices['gas'] || '—',
			modalId: 'fuelModalGas',
			img: Gas,
			title: 'Liquefied petroleum GAS',
			description: `Gas Premium – high-calorific methane gas (CH₄) compliant with Euro5 standards, with minimal impurities (≤0.1%).`,
			technology: `Gas Premium is a purified natural gas optimized for high-performance engines, ensuring efficient combustion and reduced emissions. It meets strict Euro5 environmental requirements, with sulfur content below 10 mg/kg and near-zero particulate output. Ideal for modern CNG vehicles, it delivers enhanced fuel economy and lower operational costs compared to traditional fuels."`,
		},
	]

	return (
		<>
			<main className='fuel-main'>
				<h1 className='fuel-title'>Our fuel</h1>
				<p className='fuel-description'>
					Our fuel meets the EURO-5 standard and is imported from oil refineries
					in Europe, including Poland, Lithuania, Germany, Romania, Greece, the
					USA and other countries.
				</p>
				<div className='fuel-cards'>
					{fuels.map(fuel => (
						<div
							key={fuel.type}
							className='fuel-card'
							onClick={() => openModal(fuel.type)}
						>
							<div className='fuel-type'>{fuel.type.toUpperCase()}</div>
							<div className='fuel-name'>{fuel.name}</div>
							<div className='fuel-price'>{fuel.price} ₴</div>
						</div>
					))}
				</div>
			</main>

			{/* Модальные окна */}
			{fuels.map(fuel => (
				<div
					key={fuel.modalId}
					className='fuel-modal'
					style={{ display: activeModal === fuel.type ? 'flex' : 'none' }}
					onClick={e => {
						if (e.target.classList.contains('fuel-modal')) closeModal()
					}}
				>
					<div className='fuel-modal__content'>
						<button className='fuel-modal__close' onClick={closeModal}>
							&times;
						</button>
						<h2>
							<span className='fuel-highlight'>{fuel.title}</span>
							<img src={fuel.img} alt='' className='fuel-modal-icon' />
						</h2>
						<div className='fuel-modal__body'>
							<p>{fuel.description}</p>
							<h3>Technology</h3>
							<p>{fuel.technology}</p>
						</div>
					</div>
				</div>
			))}
		</>
	)
}

export default Fuel

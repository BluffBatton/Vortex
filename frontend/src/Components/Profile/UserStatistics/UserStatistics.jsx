import React from 'react'
import './UserStatistics.css'

import {
	iconMoney,
	iconGas,
	iconPurchase,
	iconMonthly,
	iconTotalMoney,
	iconTotalGas,
} from '../../../Assets/Assets'

const statistics = [
	{
		icon: iconGas,
		alt: 'Popular gas type',
		value: '95',
		label: 'Popular gas type',
	},
	{
		icon: iconPurchase,
		alt: 'Luxury purchase',
		value: '1000 UAH',
		label: 'Luxury purchase',
	},
	{
		icon: iconMoney,
		alt: 'Average fuel cost',
		value: '1000 UAH',
		label: 'Average fuel cost',
	},
	{
		icon: iconMonthly,
		alt: 'Monthly purchases',
		value: '20',
		label: 'Monthly purchases',
	},
	{
		icon: iconTotalGas,
		alt: 'Total gas volume',
		value: '1000L',
		label: 'Total gas volume',
	},
	{
		icon: iconTotalMoney,
		alt: 'Money spent',
		value: '1000 UAH',
		label: 'Money spent',
	},
]

const UserStatistics = () => {
	return (
		<section className='accstatistics-content'>
			<h2 className='accstatistics-title'>Statistics</h2>
			<div className='accstatistics-grid'>
				{statistics.map((item, index) => (
					<div className='accstatistics-item' key={index}>
						<img
							src={item.icon}
							alt={item.alt}
							className='accstatistics-icon'
						/>
						<div className='accstatistics-value'>{item.value}</div>
						<div className='accstatistics-label'>{item.label}</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default UserStatistics

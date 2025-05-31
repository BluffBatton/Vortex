import React from 'react'
import './PurchaseHistory.css'

const purchases = [
	{ date: '2025-05-24', details: 'Purchased 20L of 95 Gas - 1000 UAH' },
	{ date: '2025-05-22', details: 'Purchased 15L of 92 Gas - 750 UAH' },
]

const PurchaseHistory = () => {
	return (
		<section className='acchistory-content'>
			<h2 className='acchistory-title'>Purchase history</h2>
			<div className='acchistory-history-wrapper'>
				{purchases.map((item, index) => (
					<div className='acchistory-history-item' key={index}>
						<div className='acchistory-history-date'>{item.date}</div>
						<div className='acchistory-history-details'>{item.details}</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default PurchaseHistory

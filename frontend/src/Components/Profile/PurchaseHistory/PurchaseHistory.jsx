import React, { useEffect, useState } from 'react'
import './PurchaseHistory.css'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../api.js'

const PurchaseHistory = () => {
	const [purchases, setPurchases] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchPurchaseHistory = async () => {
			const token = localStorage.getItem('access')
			if (!token) {
				navigate('/LogIn')
				return
			}

			try {
				const response = await fetch(`${API_BASE_URL}/api/fuel-transactions/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					throw new Error('Failed to fetch purchase history')
				}

				const data = await response.json()

				const formattedPurchases = data
					.filter(tx => tx.transaction_type === 'buy')
					.map(tx => ({
						id: tx.id,
						date: new Date(tx.date).toLocaleDateString(),
						details: `Purchased ${tx.amount}L of ${getFuelName(
							tx.fuel_type
						)} - ${tx.price} UAH`,
						rawData: tx,
					}))
					.reverse()

				setPurchases(formattedPurchases)
			} catch (err) {
				console.error('Error fetching purchase history:', err)
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchPurchaseHistory()
	}, [navigate])

	const getFuelName = fuelType => {
		const fuelNames = {
			92: '92 Gas',
			95: '95 Gas',
			100: '100 Gas',
			Gas: 'Gas',
			Diesel: 'Diesel',
		}
		return fuelNames[fuelType] || fuelType
	}

	if (loading) {
		return <div className='acchistory-loading'>Loading purchase history...</div>
	}

	if (error) {
		return <div className='acchistory-error'>Error: {error}</div>
	}

	return (
		<section className='acchistory-content'>
			<h2 className='acchistory-title'>Purchase history</h2>
			{purchases.length === 0 ? (
				<div className='acchistory-empty'>No purchases found</div>
			) : (
				<div className='acchistory-history-wrapper'>
					{purchases.map(item => (
						<div className='acchistory-history-item' key={item.id}>
							<div className='acchistory-history-date'>{item.date}</div>
							<div className='acchistory-history-details'>{item.details}</div>
						</div>
					))}
				</div>
			)}
		</section>
	)
}

export default PurchaseHistory

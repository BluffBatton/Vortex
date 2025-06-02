import React, { useEffect, useState } from 'react'
import './UserStatistics.css'
import { useNavigate } from 'react-router-dom'
import {
	iconMoney,
	iconGas,
	iconPurchase,
	iconMonthly,
	iconTotalMoney,
	iconTotalGas,
} from '../../../Assets/Assets'
import { API_BASE_URL } from '../../../api.js'

const UserStatistics = () => {
	const [statistics, setStatistics] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchStatistics = async () => {
			const token = localStorage.getItem('access')
			if (!token) {
				navigate('/LogIn')
				return
			}

			try {
				const walletResponse = await fetch(`${API_BASE_URL}/api/user/wallet/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				const transactionsResponse = await fetch(
					`${API_BASE_URL}/api/fuel-transactions/`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)

				if (!walletResponse.ok || !transactionsResponse.ok) {
					throw new Error('Failed to fetch statistics data')
				}

				const walletData = await walletResponse.json()
				const transactionsData = await transactionsResponse.json()

				const calculatedStats = calculateStatistics(
					walletData,
					transactionsData
				)
				setStatistics(calculatedStats)
			} catch (err) {
				console.error('Error fetching statistics:', err)
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchStatistics()
	}, [navigate])

	const calculateStatistics = (walletData, transactionsData) => {
		const buyTransactions = transactionsData.filter(
			tx => tx.transaction_type === 'buy'
		)

		let totalSpent = 0
		let totalLiters = 0
		const fuelTypeCounts = {}

		buyTransactions.forEach(tx => {
			totalSpent += parseFloat(tx.price)
			totalLiters += parseFloat(tx.amount)

			if (fuelTypeCounts[tx.fuel_type]) {
				fuelTypeCounts[tx.fuel_type] += parseFloat(tx.amount)
			} else {
				fuelTypeCounts[tx.fuel_type] = parseFloat(tx.amount)
			}
		})

		let popularFuelType = 'None'
		let maxAmount = 0
		for (const [type, amount] of Object.entries(fuelTypeCounts)) {
			if (amount > maxAmount) {
				maxAmount = amount
				popularFuelType = type
			}
		}

		let luxuryPurchase = 0
		if (buyTransactions.length > 0) {
			luxuryPurchase = Math.max(
				...buyTransactions.map(tx => parseFloat(tx.price))
			)
		}

		const averageCost =
			buyTransactions.length > 0
				? (totalSpent / buyTransactions.length).toFixed(2)
				: 0

		const now = new Date()
		const monthlyPurchases = buyTransactions.filter(tx => {
			const txDate = new Date(tx.date)
			return now - txDate <= 30 * 24 * 60 * 60 * 1000
		}).length

		return [
			{
				icon: iconGas,
				alt: 'Popular gas type',
				value: popularFuelType,
				label: 'Popular gas type',
			},
			{
				icon: iconPurchase,
				alt: 'Luxury purchase',
				value: `${luxuryPurchase.toFixed(2)} UAH`,
				label: 'Luxury purchase',
			},
			{
				icon: iconMoney,
				alt: 'Average fuel cost',
				value: `${averageCost} UAH`,
				label: 'Average fuel cost',
			},
			{
				icon: iconMonthly,
				alt: 'Monthly purchases',
				value: monthlyPurchases,
				label: 'Monthly purchases',
			},
			{
				icon: iconTotalGas,
				alt: 'Total gas volume',
				value: `${totalLiters.toFixed(2)}L`,
				label: 'Total gas volume',
			},
			{
				icon: iconTotalMoney,
				alt: 'Money spent',
				value: `${totalSpent.toFixed(2)} UAH`,
				label: 'Money spent',
			},
		]
	}

	if (loading) {
		return <div className='accstatistics-loading'>Loading statistics...</div>
	}

	if (error) {
		return <div className='accstatistics-error'>Error: {error}</div>
	}

	return (
		<section className='accstatistics-content'>
			<h2 className='accstatistics-title'>Statistics</h2>
			<div className='accstatistics-grid'>
				{statistics &&
					statistics.map((item, index) => (
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

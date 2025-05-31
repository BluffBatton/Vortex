import React, { useState } from 'react'
import './AdminStatistics.css'

import { Pdf } from '../../../Assets/Assets'

const AdminStatistics = () => {
	const [dateFrom, setDateFrom] = useState('19.11.2023')
	const [dateTo, setDateTo] = useState('19.11.2023')

	const [fuelData, setFuelData] = useState([
		{ type: 'A-95', quantity: '1,200,000 l', total: '25,684,000g' },
		{ type: 'A-92', quantity: '950,000 l', total: '25,684,000g' },
		{ type: 'GAS', quantity: '800,000 l', total: '25,684,000g' },
		{ type: 'A-100', quantity: '750,000 l', total: '25,684,000g' },
		{ type: 'Diesel Fuel', quantity: '600,000 l', total: '25,684,000g' },
	])

	const [totalData, setTotalData] = useState({
		totalFuel: '1,284,200 L',
		totalCash: '25,684,000g',
	})

	const handleCheck = () => {
		console.log('Fetching data for period:', dateFrom, 'to', dateTo)
	}

	const handleDownloadReport = () => {
		console.log('Downloading report for period:', dateFrom, 'to', dateTo)
	}

	return (
		<main className='adminstatistics-main'>
			<div className='adminstatistics-content'>
				<h2 className='adminstatistics-title'>Sales Statistics</h2>
				<hr className='adminstatistics-divider' />

				<div className='adminstatistics-tables-container'>
					<div className='adminstatistics-main-content'>
						{/* Таблица топ продаж */}
						<div className='adminstatistics-table-block'>
							<h3 className='adminstatistics-table-title'>
								Top-selling products
							</h3>
							<table className='adminstatistics-table'>
								<thead>
									<tr className='adminstatistics-table-header-row'>
										<th className='adminstatistics-table-header-cell'>
											Type of gas
										</th>
										<th className='adminstatistics-table-header-cell'>
											Quantity
										</th>
										<th className='adminstatistics-table-header-cell'>
											Total cash
										</th>
									</tr>
								</thead>
								<tbody>
									{fuelData.map((item, index) => (
										<tr key={index} className='adminstatistics-table-row'>
											<td className='adminstatistics-table-cell'>
												{item.type}
											</td>
											<td className='adminstatistics-table-cell'>
												{item.quantity}
											</td>
											<td className='adminstatistics-table-cell'>
												{item.total}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className='adminstatistics-table-block'>
							<h3 className='adminstatistics-table-title'>
								Total sales volume
							</h3>
							<table className='adminstatistics-table'>
								<tbody>
									<tr className='adminstatistics-table-row'>
										<td className='adminstatistics-table-cell'>Total fuel</td>
										<td className='adminstatistics-table-cell'>
											{totalData.totalFuel}
										</td>
									</tr>
									<tr className='adminstatistics-table-row'>
										<td className='adminstatistics-table-cell'>Total cash</td>
										<td className='adminstatistics-table-cell'>
											{totalData.totalCash}
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className='adminstatistics-right-panel'>
						<div className='adminstatistics-date-picker'>
							<h3 className='adminstatistics-date-title'>Select Date Range</h3>
							<div className='adminstatistics-date-inputs'>
								<div className='adminstatistics-date-group'>
									<label className='adminstatistics-date-label'>From:</label>
									<input
										type='date'
										className='adminstatistics-date-input'
										value={dateFrom}
										onChange={e => setDateFrom(e.target.value)}
									/>
								</div>
								<div className='adminstatistics-date-group'>
									<label className='adminstatistics-date-label'>To:</label>
									<input
										type='date'
										className='adminstatistics-date-input'
										value={dateTo}
										onChange={e => setDateTo(e.target.value)}
									/>
								</div>
							</div>
							<button
								className='adminstatistics-check-button'
								onClick={handleCheck}
							>
								Check
							</button>
						</div>

						<button
							className='adminstatistics-report-button'
							onClick={handleDownloadReport}
						>
							Finance Reports
							<img
								src={Pdf}
								alt='Report icon'
								className='adminstatistics-report-icon'
							/>
						</button>
					</div>
				</div>
			</div>
		</main>
	)
}

export default AdminStatistics

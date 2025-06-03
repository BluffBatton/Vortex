import React, { useState } from 'react'
import './Complaints.css'

const Complaints = () => {
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')

	const handleSend = () => {
		if (subject.trim() === '') {
			alert('Fill the subject message')
			return
		}

		// Здесь может быть ваш API-запрос
		console.log('Subject:', subject)
		console.log('Message:', message)

		// Очистка полей
		setSubject('')
		setMessage('')
		alert('Message successfully sent')
	}

	return (
		<section className='acccomplains-content'>
			<h2 className='acccomplains-title'>Complaints and suggestions</h2>
			<form className='acccomplains-form'>
				<label>
					<span className='acccomplains-label-text'>Subject message</span>
					<input
						type='text'
						className='acccomplains-input-field'
						value={subject}
						onChange={e => setSubject(e.target.value)}
					/>
				</label>
				<label>
					<span className='acccomplains-label-text'>Message</span>
					<textarea
						className='acccomplains-big-input-field'
						value={message}
						onChange={e => setMessage(e.target.value)}
					></textarea>
				</label>
				<button
					type='button'
					className='acccomplains-save'
					onClick={handleSend}
				>
					Send
				</button>
			</form>
		</section>
	)
}

export default Complaints

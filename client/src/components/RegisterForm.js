import React from 'react';
import '../stylesheets/register.css';
import { signupUser } from '../api/authServlet';
import { useNavigate } from 'react-router-dom';
import { SERVER_ERROR, UNAUTHORIZED } from '../constants';

export const RegisterForm = () => {
	const navigate = useNavigate();
	//Input fields
	const [password, setPassword] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [first_name, setFirstName] = React.useState('');
	const [last_name, setLastName] = React.useState('');
	const [verification, setVerification] = React.useState('');

	//Error description variables
	const [verificationError, setVerificationError] = React.useState('');
	const [firstNameError, setFirstNameError] = React.useState('');
	const [lastNameError, setLastNameError] = React.useState('');
	const [emailError, setEmailError] = React.useState('');
	const [passwordError, setPasswordError] = React.useState('');

	function refreshErrorMessages () {
		setVerificationError('');
		setFirstNameError('');
		setLastNameError('');
		setEmailError('');
		setPasswordError('');
	}

	function validateUser () {
		if (!first_name) {
			setFirstNameError('First Name is required')
			return false
		}
		if (!last_name) {
			setLastNameError('Last name is required');
			return false
		}
		if (!email) {
			setEmailError('Email is required');
			return false
		}
		if (email && (!email.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/))) {
			setEmailError('Invalid email format');
			return false
		}
		if (!password) {
			setPasswordError('Password is required');
			return false
		}
		if (password && (password.toLowerCase().includes(first_name.toLowerCase()) || password.toLowerCase().includes(last_name.toLowerCase()))) {
			setPasswordError('Password cannot contain your name');
			return false 
		}
		if (password && (password !== verification)){
			setVerificationError('Passwords do not match');
			return false	
		}

		return true
	}
  
	const signup = async () => {
		refreshErrorMessages()
		if (!validateUser()) {
			return
		}

		const user = {
			first_name: first_name,
			last_name: last_name,
			email: email,
			password: password
		}
		
		try {
			await signupUser(user)
			navigate('/login')
		}
		catch (err) {
			if (err.status === UNAUTHORIZED) {
				setVerificationError('User already exists')
			}
			else if (err.status === SERVER_ERROR) {
				setVerificationError('Internal server error. PLease try again later')
			}
		}
	}
    return (
		<div className='background'>
			<div className='container'> 
				<h1 className='title'>Fake Stack Overflow</h1>
				<input
					type="text"
					placeholder="Enter First Name"
					value={first_name}
					onChange={(e) => setFirstName(e.target.value)}
					className={`input-field half-width ${firstNameError ? 'error' : ''}`}
				/>
				{firstNameError && <div className="error-message">{firstNameError}</div>}
				<input
					type="text"
					placeholder="Enter Last Name"
					value={last_name}
					onChange={(e) => setLastName(e.target.value)}
					className={`input-field half-width ${lastNameError ? 'error' : ''}`}
				/>
				{lastNameError && <div className="error-message">{lastNameError}</div>}
				<input
					type="email"
					placeholder="Enter email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={`input-field ${emailError ? 'error' : ''}`}
				/>
				{emailError && <div className="error-message">{emailError}</div>}
				<input
					type="password"
					placeholder="Enter password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className={`input-field ${passwordError ? 'error' : ''}`}
				/>
				{passwordError && <div className="error-message">{passwordError}</div>}
				<input
					type="password"
					placeholder="Enter verification"
					value={verification}
					onChange={(e) => setVerification(e.target.value)}
					className={`input-field ${verificationError ? 'error' : ''}`} 
				/>
				{verificationError && <div className="error-message">{verificationError}</div>}
				<button className='login_page_button' onClick={signup}>Sign Up</button>
			</div>
		</div>
    );
}
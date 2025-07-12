import React from 'react';
import '../stylesheets/login.css';
import { loginUser } from '../api/authServlet';
import { UNAUTHORIZED, SUCCESS, SERVER_ERROR } from '../constants';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
	const navigate = useNavigate()
	const {setUser} = useUser()
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState('')

    const logIn = async () => {
        if (!email || !password) {
            setError("Both email and password are required!");
            return
        }

		try {
			const response = await loginUser(email, password)
			setUser(response.data.user)
			navigate(`/home/${response.data.user.firstName}`)
		}
		catch (err) {
			if (err.status === UNAUTHORIZED) {
				setError('Login failed. Please check your credentials.')
			}
			else if (err.status === SERVER_ERROR) {
				setError('Internal server error. Please try again later.')
			}
		}
    }

    return (
      <div className='background'>
        <div className='container'>
          <h1 className='title'>Fake Stack Overflow</h1>
          <input
            	type="email"
            	placeholder="Enter email"
            	value={email}
            	onChange={(e) => {
              	setEmail(e.target.value)
            	setError('')
            }}
            className={`input-field ${error ? 'error' : ''}`}
          />
          <input
				type="password" 
				placeholder="Enter password"
				value={password}
				onChange={(e) => {
				setPassword(e.target.value)
				setError('')
				}}
            	className={`input-field ${error ? 'error' : ''}`}
          />
          {error && <div className="error-message">{error}</div>}
          <button className='login_page_button' onClick={logIn}>Login</button>
        </div>
      </div>
    );
}

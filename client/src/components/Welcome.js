import '../stylesheets/welcomePage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { setToLocalStorage } from '../util/LocalStorageHelper';
import { USER_KEY } from '../constants';


export default function Welcome() {
	const {setUser} = useUser()
	const navigate = useNavigate()

  	const setToHome = () => {
		const guestUser = {
			firstName: 'guest',
			lastName: 'guest',
			isGuest: true,
			isAdmin: false
		}

		setUser(guestUser)
		setToLocalStorage(USER_KEY, guestUser)
		navigate('/home/guest')
  	}

  	const setToLogin = () => {
		navigate('/login')
  	}	

  	const setToRegister = () => {
		navigate('/register')
  	}

  	return (
   		<div className='background'>
      		<div className='container'> 
        		<h1 className='title'>Fake Stack Overflow</h1>
        		<button className='login' onClick={setToLogin} >Login</button>
        		<button className='register' onClick={setToRegister}>Register</button>
        		<button className='guest' onClick={setToHome}>Continue as Guest</button>
      		</div>
    	</div>
  	);
}

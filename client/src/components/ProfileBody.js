import React from "react";
import { useUser } from "../context/UserContext";

export const ProfileBody = () => {
	const {user} = useUser()
	const [view, setView] = React.useState('questions');

	const handleLogout = () => {
		
	}

	return (
		<>	
			<div className='main-content3'>
                <div className='user-info'>
                    <h2> {user && user.firstName + " " + user.lastName} </h2>
                    <p> {"Member for "} </p>
                    <p> {user && "Reputation: " + user.reputation} </p>
                    {user && !user.isGuest !== null && <button> Back </button>}
                </div>
                <div className='view-selection'>
                    <button onClick={() => setView('questions')}>Questions</button>
                    <button onClick={() => setView('tags')}>Tags</button>
                    <button onClick={() => setView('answers')}>Answers</button>
                    {user && user.isAdmin && <button onClick={() => setView('users')}>Users</button>}
                </div>
                <h2>{view.charAt(0).toUpperCase() + view.slice(1)}:</h2>
                {view === 'questions' && <div></div>}
                {view === 'tags' && <div></div>}
                {view === 'answers' && <div></div>}
                {view === 'users' && <div></div>};
            </div>
		</>
	)
}
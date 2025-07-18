import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const Sidebar = () => {
	const {user} = useUser()
	const navigate = useNavigate()

	const setToHomePage = () => {
		navigate(`/home/${user.firstName}`)
	} 
	 
	const navigatehome = () => {
		
	}

	return (
		<div className="sidebar">
			<button type="button" onClick={setToHomePage} className="question" >
				<h2> Questions </h2>
			</button>
			<button type="button" onClick={navigatehome} className="tags">
				<h2> Tags </h2>
			</button>
		</div>
	);
}
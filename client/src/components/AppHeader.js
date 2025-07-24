import React from "react";
import { toast }  from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { GUEST_MSG } from "../constants";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
	const {user} = useUser()
	const [searchData, setSearchData] = React.useState("");
	const navigate = useNavigate()

	const filledSearch = (event) => {
		event.preventDefault();
	}

	const goToProfilePage = () => {
		navigate(`/profile/${user.firstName}`)
	}

	return (
		<div className="header">
			{user && !user.isGuest && <a href="#" className="profile-icon" onClick={goToProfilePage}> 👤 Profile </a>}
			<h1> Fake Stack Overflow </h1>
			<form className="search_form" onSubmit={filledSearch}>
				<input type="text" placeholder="Search..." className="search" onChange={(event) => setSearchData(event.target.value)}></input>
			</form>
		</div>
	);
}
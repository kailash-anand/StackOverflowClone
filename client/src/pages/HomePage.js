import React from "react";
import { GUEST_MSG } from "../constants";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { HomePageBody } from "../components/HomePageBody";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
	const {user, setUser} = useUser()
	const {firstName} = useParams()
	const navigate = useNavigate()

	// To handle persistant login and edge cases
	useEffect(() => {
		if (user && user.isGuest && !toast.isActive('guest-toast')) {
			toast.info(GUEST_MSG, { toastId: 'guest-toast'})
		}

		if (user) {
			localStorage.setItem('activeUser', JSON.stringify(user))
		}
		
		const activeUser = JSON.parse(localStorage.getItem('activeUser'))

		if (!activeUser || activeUser.isGuest) {
			return
		}

		if (activeUser && activeUser.firstName !== firstName) {
			navigate(`/home/${activeUser.firstName}`)
			return
		}

		setUser(activeUser)
	}, [user, firstName, navigate, setUser])

	return (
		<>
			<AppHeader/>
			<Sidebar/>
			<HomePageBody />
		</>
	)
}
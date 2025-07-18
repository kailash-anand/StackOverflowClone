import React from "react";
import { GUEST_MSG, USER_KEY } from "../constants";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { HomePageBody } from "../components/HomePageBody";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage, setToLocalStorage } from "../util/LocalStorageHelper";

export default function HomePage() {
	const {user, setUser} = useUser()
	const {firstName} = useParams()
	const navigate = useNavigate()

	// To handle persistant login and edge cases
	useEffect(() => {
		if (!user) {
			const activeUser = getFromLocalStorage(USER_KEY)

			if (activeUser) {
				setUser(activeUser)
			}
		}

		if (user && user.isGuest && !toast.isActive('guest-toast')) {
			toast.info(GUEST_MSG, { toastId: 'guest-toast'})
		}
		
		if (user && user.firstName !== firstName) {
			navigate(`/home/${user.firstName}`)
		}

	}, [user, firstName, navigate, setUser])

	return (
		<>
			<AppHeader/>
			<Sidebar/>
			<HomePageBody />
		</>
	)
}
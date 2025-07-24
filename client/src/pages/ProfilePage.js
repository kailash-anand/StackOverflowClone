import React, { act, useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { getFromLocalStorage } from "../util/LocalStorageHelper";
import { USER_KEY } from "../constants";
import { ProfileBody } from "../components/ProfileBody";

export default function ProfilePage () {
	const {user,setUser} = useUser()
	const {firstName} = useParams()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			const activeUser = getFromLocalStorage(USER_KEY)

			if (activeUser) {
				setUser(activeUser)
			}
		}

		if (user && user.isGuest) {
			navigate(`/home/${user.firstName}`)
		}

		if (user && user.firstName !== firstName) {
			navigate(`/profile/${user.firstName}`)
		}
	}, [user, setUser, navigate, firstName])


	return (
		<>
			<AppHeader/>
			<Sidebar/>
			<ProfileBody/>
		</>
	)
}
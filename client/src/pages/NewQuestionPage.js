import React from "react";
import { USER_KEY, GUEST_MSG } from "../constants";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { NewQuestionForm } from "../components/NewQuestionForm";
import { getFromLocalStorage } from "../util/LocalStorageHelper";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NewQuestionPage() {
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

		if (user && user.isGuest) {
			navigate(`/home/${user.firstName}`)
		}
		
		if (user && user.firstName !== firstName) {
			navigate(`/home/${user.firstName}`)
		}

	}, [user, firstName, navigate, setUser])

    return (
        <>
            <AppHeader/>
            <Sidebar />
            <NewQuestionForm />
        </>
    )
}
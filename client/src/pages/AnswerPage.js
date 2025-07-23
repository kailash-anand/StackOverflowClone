import React, { useEffect } from "react";
import { AppHeader } from "../components/AppHeader";
import { Sidebar } from "../components/Sidebar";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { getFromLocalStorage } from "../util/LocalStorageHelper";
import { USER_KEY } from "../constants";
import { AnswerBody } from "../components/AnswerBody";


export default function AnswersPage() {
    const {user, setUser} = useUser()
    const firstName = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            const activeUser = getFromLocalStorage(USER_KEY)

            if (activeUser) {
                setUser(activeUser)
            }
        }

        if (user && user.firstName !== firstName) {
            navigate(`/home/${user.firstName}`)
        }
    }, [user, firstName, navigate, setUser])

    return (
        <>
            <AppHeader />
            <Sidebar />
            <AnswerBody />
        </>
    )
}
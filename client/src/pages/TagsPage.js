import React, { useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { AppHeader } from '../components/AppHeader'
import { Sidebar } from '../components/Sidebar'
import { TagsPageBody } from '../components/TagsPageBody'
import { getFromLocalStorage } from '../util/LocalStorageHelper'
import { USER_KEY } from '../constants'
import { useNavigate, useParams } from 'react-router-dom'

export default function TagsPage () {
	const {user, setUser} = useUser()
	const {firstName} = useParams()
	const navigate = useNavigate()
	
	useEffect(() => {
		if (!user) {
			const activeUser = getFromLocalStorage(USER_KEY)

			if (activeUser) {
				setUser(activeUser)
			}
		}

		if (user && user.firstName !== firstName) {
			navigate(`/tags/${user.firstName}`)
		}
	}, [user, firstName, navigate, setUser])

	return (
		<>
			<AppHeader />
			<Sidebar />
			<TagsPageBody />
		</>
	)
}
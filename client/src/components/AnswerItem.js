import React, { useEffect, useState } from "react";
import { findDate } from "../util/ObjHelper";
import { getUserById } from "../api/UserServlet";
import { toast } from "react-toastify";


export const AnswerItem = (props) => {
    const answer = props.answer
	const [user, setUser] = useState(null)

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await getUserById(answer.ans_by)
				setUser(response.data.data)
			}
			catch (err) {
				toast.error("Could not get user who answered")
			}
		}

		getUser()
	}, [])

	return (
		<>
			<div className="answer">
				<p className="answerText">{answer.text}</p>
				<div className="answerFooter">
					<span className="answerVotes">{answer.votes} Votes</span>
					<span className="answerDetails">
					<span className="answerAuthor">{user && user.first_name + " " + user.last_name}</span>
					<span className="answerDate">{findDate(new Date(answer.ans_date_time))}</span>
					</span>
				</div>
			</div>
		</>
	)
}
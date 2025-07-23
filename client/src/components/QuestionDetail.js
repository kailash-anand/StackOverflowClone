import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getQuestionTags } from "../api/QuestionServlet";
import { getUserById } from "../api/UserServlet";
import { findDate } from "../util/ObjHelper";
import { useUser } from "../context/UserContext";


export const QuestionDetail = (props) => {
	let currentQuestion = props.question
	const userContext = useUser()
	const currUser = userContext.user
	const [user, setUser] = useState(null)
	const [tags, setTags] = useState([])

	useEffect(() => {
		const getUser = async () => {
			try {
				const response = await getUserById(currentQuestion.askedBy)
				setUser(response.data.data)
			}
			catch (err) {
				toast("User not found")
			}
		}
		
		const getTags = async () => {
			try {
				const response = await getQuestionTags(currentQuestion._id)
				setTags(response.data)
			}
			catch (err) {
				toast("Tags not found")
			}
		}
		
		getUser()
		getTags()
	}, [])

    return (
		<div className="questionDetails">
			<h1 className="questionTitle">{currentQuestion.title}</h1>
			<div className="stats">
				<p className="answersCount"><strong>Answers:</strong> {currentQuestion.answers.length}</p>
				<p className="viewsCount"><strong>Views:</strong> {currentQuestion.views}</p>
				<p className="votesCount"><strong>Votes:</strong> {currentQuestion.votes}</p>
			</div>
			<h3 className="subheading">Text:</h3>
			<p className="questionText">{currentQuestion.text}</p>
			<h3 className="subheading">Tags:</h3>
			<div className="tagsContainer">
				{tags.map((tag) => (
                	<p className="bottom" key={tag._id}> {tag.name} </p>
            	))}
			</div>
				<h3 className="subheading">Asked by:</h3>
			<div className="askedBy">
				<p className="username">{user && user.first_name + " " + user.last_name}</p>
				<p className="date">{findDate(new Date(currentQuestion.ask_date_time))}</p>
			</div>
			<div className="VotesContainer">
				{!currUser.isGuest ? (
				<>
					<h1>Vote</h1>
					<button key="upvote" >Upvote</button>
					<button key="downvote" >Downvote</button>
				</>
				) : (
				<div></div>
				)}
			</div>
		</div>
	)
}
import React, { useEffect, useState } from "react";
import { QuestionDetail } from "./QuestionDetail";
import { AnswerItem } from "./AnswerItem";
import { useParams } from "react-router-dom";
import { getQuestionAnswers, getQuestionById } from "../api/QuestionServlet";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

export const AnswerBody = () => {
	const {user} = useUser()
    const params = useParams()
	const questionId = params.questionId
	const [question, setQuestion] = useState(null)
	const [allAnswers, setAllAnswers] = useState([])

	useEffect(() => {
		const getQuestion = async () => {
			try {
				const response = await getQuestionById(questionId)

				if (response) {
					setQuestion(response.data)
				}
			}
			catch (error) {
				toast.error("Could not get question")
			}
		}

		const getAnswers = async () => {
			try {
				const response = await getQuestionAnswers(questionId)

				if (response) {
					setAllAnswers(response.data)
				}
			}
			catch (error) {
				toast.error("Could not get question answers")
			}
		}

		getQuestion()
		getAnswers()
	}, [])
    
    return (
        <>
			<div className="mainContent">
				{question && <QuestionDetail question={question}/>}
				<h2 className="answersSubtitle">Answers</h2>
				{allAnswers.map((answer) => (
					<AnswerItem key={answer._id} answer={answer}/>
				))}
				{(user && !user.isGuest) ? (
					<button className="answerQuestionBtn"> Answer Question </button>
				) : ( <div></div> )}
			</div>
        </>
    )
}
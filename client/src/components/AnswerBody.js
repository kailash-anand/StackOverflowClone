import React, { useEffect, useState } from "react";
import { QuestionDetail } from "./QuestionDetail";
import { AnswerItem } from "./AnswerItem";
import { useParams } from "react-router-dom";
import { getQuestionAnswers, getQuestionById } from "../api/QuestionServlet";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";
import { addAnswer } from "../api/AnswerServlet";

export const AnswerBody = () => {
	const {user} = useUser()
    const params = useParams()
	const questionId = params.questionId
	const [question, setQuestion] = useState(null)
	const [allAnswers, setAllAnswers] = useState([])
	const [showAnswerForm, setShowAnswerForm] = useState(false);
    const [answerText, setAnswerText] = useState("");

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

	const handleSubmit = async () => {
		if (!answerText.trim()) {
			return toast.error("Answer cannot be empty")
		}
	
		try {
			const newAnswer = {
				text: answerText,
				ans_by: user.email
			}

			const response = await addAnswer(questionId, newAnswer)
			allAnswers.push(response.data)
			setShowAnswerForm(false)
			setAnswerText("")
		}
		catch (err) {
			toast.error("Failed to post answer")
		}
	}

	const handleCancel = () => {
		setShowAnswerForm(false)
		setAnswerText("")
	}
    
    return (
        <>
			<div className="mainContent">
				{question && <QuestionDetail question={question}/>}
				<h2 className="answersSubtitle">Answers</h2>
				{allAnswers.map((answer) => (
					<AnswerItem key={answer._id} answer={answer}/>
				))}
				{showAnswerForm ? (
					<div className="answerForm">
						<textarea
							value={answerText}
							onChange={(e) => setAnswerText(e.target.value)}
							placeholder="Type your answer here..."
						/>
						<div style={{ textAlign: "right" }}>
							<button onClick={handleSubmit}>Submit</button>
							<button onClick={handleCancel}>Cancel</button>
						</div>
					</div>
            	) : 
				(user && !user.isGuest) ? (
					<button className="answerQuestionBtn" onClick={() => setShowAnswerForm(true)}> Answer Question </button>
				) : ( <div></div> )}
			</div>
        </>
    )
}
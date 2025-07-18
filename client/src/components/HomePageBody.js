import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { QuestionHeader } from "./QuestionHeader";
import { QuestionItem } from "./QuestionItem";
import { getAllQuestions } from "../api/QuestionServlet";

export const HomePageBody = () => {
	const [questions, setQuestions] = useState([])
	
	useEffect(() => {
		const getDisplayQuestions = async () => {
			try{
				const response = await getAllQuestions()
				setQuestions(response.data)
			}
			catch (err) {
				toast.error("Counld not get questions")
			}
		}

		getDisplayQuestions()
	}, [])


	return (
		<>
			<QuestionHeader />
			{questions && questions.map((question) => (
				<QuestionItem key={question._id} question={question}/>
			))}
		</>
	)
}
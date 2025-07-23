import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { QuestionHeader } from "./QuestionHeader";
import { QuestionItem } from "./QuestionItem";
import { getAllQuestions } from "../api/QuestionServlet";
import { useLocation } from "react-router-dom";

export const HomePageBody = () => {
	const location = useLocation()
	const [allQuestions, setAllQuestions] = useState([])
	const [displayQuestions, setDisplayQuestions] = useState([])
	
	// To fetch all questions
	useEffect(() => {
		const getDisplayQuestions = async () => {
			try{
				const response = await getAllQuestions()
				setAllQuestions(response.data)
			}
			catch (err) {
				toast.error("Counld not get questions")
			}
		}

		getDisplayQuestions()
	}, [])

	// To filter based on query params
	useEffect(() => {
		const queryParams = new URLSearchParams(location.search)
		const tag = queryParams.get('tag')

		if (tag) {
			const questionsWithTag = []

			for (const question of allQuestions) {
				const questionTags = question.tags

				if (questionTags.includes(tag)) {
					questionsWithTag.push(question)
				}
			}

			setDisplayQuestions(questionsWithTag)
		}
		else {
			setDisplayQuestions(allQuestions)
		}
	}, [location.search, allQuestions])


	return (
		<>
			<QuestionHeader questionCount={displayQuestions.length}/>
			{displayQuestions && displayQuestions.map((question) => (
				<QuestionItem key={question._id} question={question}/>
			))}
		</>
	)
}
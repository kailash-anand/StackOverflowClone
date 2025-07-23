import { ADD_ANSWER } from "../constants"
import { makeApiCall } from "./ApiServlet"

export const getAnswerById = (answerId) => {
    try {
        
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const addAnswer = async (questionId, answerData) => {
	try {
		return await makeApiCall(ADD_ANSWER(questionId), 'POST', answerData)
	} catch (err) {
        console.error(err)
        throw err
    }
}

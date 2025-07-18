import React from "react";
import { makeApiCall } from './ApiServlet'
import { GET_ALL_QUESTIONS, GET_ANSWER_COUNT_FOR_QUESTION, GET_QUESTION_COUNT, GET_QUESTION_TAGS } from "../constants";

export const getAllQuestions = async () => {
    try {
        return await makeApiCall(GET_ALL_QUESTIONS, 'GET')
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export const getQuestionCount = async () => {
    try {
        return await makeApiCall(GET_QUESTION_COUNT, 'GET')
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export const getQuestionTags = async (questionId) => {
    try {
        return await makeApiCall(GET_QUESTION_TAGS(questionId), 'GET')
    }
    catch (err) {
        console.error(err)
        throw err
    }
}


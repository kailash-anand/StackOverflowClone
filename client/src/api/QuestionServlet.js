import React from "react";
import { makeApiCall } from './ApiServlet'
import { GET_ALL_QUESTIONS, GET_QUESTION_COUNT, GET_QUESTION_TAGS, ADD_QUESTION } from "../constants";

export const getAllQuestions = async () => {
    try {
        return await makeApiCall(GET_ALL_QUESTIONS, 'GET')
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const getQuestionCount = async () => {
    try {
        return await makeApiCall(GET_QUESTION_COUNT, 'GET')
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const getQuestionTags = async (questionId) => {
    try {
        return await makeApiCall(GET_QUESTION_TAGS(questionId), 'GET')
    } catch (err) {
        console.error(err)
        throw err
    }
}

export const addQuestion = async (questionData) => {
    try {
        return await makeApiCall(ADD_QUESTION, 'POST', questionData);
    } catch (err) {
        console.error(err);
        throw err;
    }
}


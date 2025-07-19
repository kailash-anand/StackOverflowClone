import React from "react";
import { makeApiCall } from "./ApiServlet";
import { GET_ALL_TAGS, GET_TAG_QUESTION_COUNT, GET_TAGS_COUNT } from "../constants";

export const getAllTags = async () => {
    try {
        return await makeApiCall(GET_ALL_TAGS, 'GET')
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export const getTagsCount = async () => {
	try {
		return await makeApiCall(GET_TAGS_COUNT, 'GET')
	}
	catch (err) {
		console.error(err)
		throw err
	}
}

export const getTagQuestionCount = async (tagId) => {
	try {
		return await makeApiCall(GET_TAG_QUESTION_COUNT(tagId), 'GET')
	}
	catch (err) {
		console.error(err)
		throw err
	}
}

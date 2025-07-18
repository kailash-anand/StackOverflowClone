import React from "react";
import { makeApiCall } from "./ApiServlet";
import { GET_ALL_TAGS } from "../constants";

export const getAllTags = async () => {
    try {
        return await makeApiCall(GET_ALL_TAGS, 'GET')
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

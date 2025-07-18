import React from "react";
import { makeApiCall } from "./ApiServlet";
import { GET_USER_BY_ID } from "../constants";

export const getUserById = async (userID) => {
    try {
        return await makeApiCall(GET_USER_BY_ID(userID), 'GET')
    }
    catch (err) {
        console.log(err)
        throw err
    }
}


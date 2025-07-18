import { LOGIN, ADD_USER, VERIFY_USER } from "../constants/index" 
import { SUCCESS } from "../constants/index";
import { makeApiCall } from "./ApiServlet";

export const loginUser = async (email, password) => {
    try {
		return await makeApiCall(LOGIN, 'POST', {email, password})
	}
	catch (err) {
		console.error(err)
		throw err
	}
}

export const signupUser = async (newUser) => {
	try {
		const email = newUser.email
		await makeApiCall(VERIFY_USER(email), 'GET')
		return await makeApiCall(ADD_USER, 'POST', newUser)
	}
	catch (err) {
		console.error(err)
		throw err
	}
}

export const logoutUser = async () => {

}


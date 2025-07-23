import axios from "axios";

/**
 * Makes an API call to the server based on the provided params
 * 
 * @param {string} url - The endpoint URL to send the request to.
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - The HTTP method to use.
 * @param {object} [body] - Optional request body
 * 
 * @returns {Promise<any>} - The response from the server
 */
export const makeApiCall = async (url, method, body) => {
	try {
		switch (method) {
			case 'GET':
				return await axios.get(url)
				
			case 'POST':
				if (!body) throw new Error('POST required a body')
				return await axios.post(url, body)

			case 'PUT':
				if (!body) throw new Error('PUT required a body')
				return await axios.put(url, body)

			case 'DELETE':
				return await axios.delete(url)

			default:
				throw new Error(`Unsupported method: ${method}`)
		}
	}
	catch (err) {
		console.error(`API call failed [${method} ${url}]:`, err);
		throw err
	}
}
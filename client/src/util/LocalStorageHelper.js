import { isValidJSON } from "./JsonHelper";


export const setToLocalStorage = (key, value) => {
	try {
		localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
	}
	catch (err) {
		console.error("Could not set to localstorage: ", err)
	}
}

export const getFromLocalStorage = (key) => {
	try {
		const value = localStorage.getItem(key)
		return isValidJSON(value) ? JSON.parse(value) : value
	}
	catch (err) {
		console.error("Could not get from localstorage: ", err)
		return null
	}
}

export const removeFromLocalStorage = (key) => {
	try {
		localStorage.removeItem(key)
		return true
	}
	catch (err) {
		console.error("Could not remove from localstorage: ", err)
		return false
	}
}


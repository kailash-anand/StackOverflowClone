import { isValidJSON } from "./JsonHelper";

/**
 * Utility class for operation to local storage
 */

function setJSONToLocalStorage(key, data) {
	if (typeof key !== 'string') {
		return
	}

	if (isValidJSON(data)) {
		localStorage.setItem
	}
	
}
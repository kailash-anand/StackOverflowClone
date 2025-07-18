/**
 * Utility class for json 
 */

export const isValidJSON = (data) => {
	if (typeof data !== 'string') {
		return false
	}

	try {
		const parsed = JSON.parse(data)
		return typeof parsed === 'object' && parsed !== null
	}
	catch (err) {
		return false
	}
}
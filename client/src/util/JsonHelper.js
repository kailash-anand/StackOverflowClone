/**
 * Utility class for json 
 */

export const isValidJSON = (data) => {
	if (typeof data !== 'string') {
		return
	}

	try {
		const parsed = JSON.parse(data)
		return typeof parsed === 'object' && parsed !== null
	}
	catch (err) {
		return false
	}
}
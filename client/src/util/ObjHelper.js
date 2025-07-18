import { getFromLocalStorage } from "./LocalStorageHelper"

export const getQuestionCount = () => {
    try {
        const questions = getFromLocalStorage('questions')
        return questions.length
    }
    catch (err) {
        console.error("Error fetching data")
        return null
    }
}

export const loadQuestions = () => {
    try {
        const questions = getFromLocalStorage('questions')
        return questions
    }
    catch (err) {
        console.error("Error fetching data")
        return null
    }
}

export const persistLogin = (user) => {
    
}

export const findDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');

    if (days < 1) {
        if (hours < 1) {
        if (minutes < 1) {
            return seconds + " seconds ago";
        } else {
            return minutes + " minutes ago";
        }
        } else {
        return hours + " hours ago";
        }
    } 
    else if (days < 2) {
        return `${month} ${dayOfMonth} at ${hour}:${minute}`;
    } 
    else {
        return `${month} ${dayOfMonth}, ${year} at ${hour}:${minute}`;
    }
}

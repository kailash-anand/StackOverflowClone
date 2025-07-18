//API 
///USER
////GET
export const VERIFY_USER = (email) => `http://localhost:8000/api/verifyUserEmail/${encodeURIComponent(email)}`
export const GET_USER_BY_EMAIL = (email) => `http://localhost:8000/api/getUserByEmail/${encodeURIComponent(email)}`
export const GET_USER_BY_ID = (userId) => `http://localhost:8000/api/getUserById/${userId}`
////POST
export const LOGIN = "http://localhost:8000/api/login"
export const ADD_USER = "http://localhost:8000/api/user"
///QUESTION
////GET
export const GET_ALL_QUESTIONS = "http://localhost:8000/api/questions"
export const GET_QUESTION_COUNT = "http://localhost:8000/api/getQuestionCount"
export const GET_QUESTION_TAGS = (questionId) => `http://localhost:8000/api/getQuestionTags/${questionId}`
////POST
///TAG
////GET
export const GET_ALL_TAGS = "http://localhost:8000/api/tags"
////POST

//Response Codes
export const UNAUTHORIZED = 401
export const NOT_FOUND = 404
export const SERVER_ERROR = 500
export const SUCCESS = 200


//Other
export const GUEST_MSG = 'You are logged in as a guest. To experience all features, please signup as user'
export const USER_KEY = 'activeUser'


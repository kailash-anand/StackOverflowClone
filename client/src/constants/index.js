//API 
///USER
////GET
export const VERIFY_USER = (email) => `http://localhost:8000/api/verifyUserEmail/${encodeURIComponent(email)}`
export const GET_USER_BY_EMAIL = (email) => `http://localhost:8000/api/getUserByEmail/${encodeURIComponent(email)}`
export const GET_USER_BY_ID = (userId) => `http://localhost:8000/api/getUserById/${userId}`
////POST
export const LOGIN = "http://localhost:8000/api/login"
export const ADD_USER = "http://localhost:8000/api/addUser"
///QUESTION
////GET
export const GET_ALL_QUESTIONS = "http://localhost:8000/api/questions"
export const GET_QUESTION_BY_ID = (questionId) => `http://localhost:8000/api/questions/${questionId}`
export const GET_QUESTION_COUNT = "http://localhost:8000/api/getQuestionCount"
export const GET_QUESTION_TAGS = (questionId) => `http://localhost:8000/api/getQuestionTags/${questionId}`
export const GET_QUESTION_ANSWERS = (questionId) => `http://localhost:8000/api/questions/${questionId}/answers`
////PUT
export const INCREMENT_QUESTION_VIEWS = (questionId) => `http://localhost:8000/api/questions/${questionId}/incr_views`
////POST
export const ADD_QUESTION = "http://localhost:8000/api/question"
///TAG
////GET
export const GET_ALL_TAGS = "http://localhost:8000/api/tags"
export const GET_TAGS_COUNT = "http://localhost:8000/api/tags/count"
export const GET_TAG_QUESTION_COUNT = (tagId) => `http://localhost:8000/api/tags/${tagId}/question_count`
///ANSWER
////POST
export const ADD_ANSWER = (questionId) => `http://localhost:8000/api/answers/${questionId}`


//Response Codes
export const UNAUTHORIZED = 401
export const NOT_FOUND = 404
export const SERVER_ERROR = 500
export const SUCCESS = 200


//Other
export const GUEST_MSG = 'You are logged in as a guest. To experience all features, please signup as user'
export const USER_KEY = 'activeUser'


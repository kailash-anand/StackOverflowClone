import React, { useEffect, useState } from "react";
import { findDate } from "../util/ObjHelper"; 
import { getUserById } from "../api/UserServlet";
import { toast } from "react-toastify";
import { getQuestionTags, viewQuestion } from "../api/QuestionServlet";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const QuestionItem = (props) => {
    const question = props.question 
	const currUser = useUser().user // User logged in
    const [user, setUser] = useState(null) // User who asked current question
    const [tags, setTags] = useState([])
    const navigate = useNavigate()

    const goToAnswerPage = async () => {
		try {
			await viewQuestion(question._id)
			navigate(`/answers/${currUser.firstName}/${question._id}`)
		}
		catch (err) {
			toast.error("Error viewing question")
		}
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await getUserById(question.askedBy)
                setUser(response.data.data)
            }
            catch (err) {
                toast("User not found")
            }
        }

        const getTags = async () => {
            try {
                const response = await getQuestionTags(question._id)
                setTags(response.data)
            }
            catch (err) {
                toast("Tags not found")
            }
        }

        getUser()
        getTags()
    }, [])

    return (
        <div className="container2">
            <pre className="left">
                {question.answers.length + " answers\n" + question.views + " views\n" + question.votes + " votes"}
            </pre>
            <a className="middle" href="#" onClick={goToAnswerPage}>
                {question.title}
            </a>
            <p className="right">
                <span className="askedBy"> {user && user.first_name + " " + user.last_name} </span>
                <span className="askDate"> asked {findDate(new Date(question.ask_date_time))}</span>
            </p>
            <p className='summary'>
                {"Summary: " + question.summary}
            </p>
            <div className="tagContainer">
                {tags.map((tag) => (
                    <p className="bottom" key={tag._id}> {tag.name} </p>
                ))}
            </div>
        </div>
    );
}
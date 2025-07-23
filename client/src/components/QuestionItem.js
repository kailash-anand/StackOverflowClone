import React, { useEffect, useState } from "react";
import { findDate } from "../util/ObjHelper"; 
import { getUserById } from "../api/UserServlet";
import { toast } from "react-toastify";
import { getQuestionTags } from "../api/QuestionServlet";
import { useNavigate } from "react-router-dom";

export const QuestionItem = (props) => {
    const question = props.question 
    const [user, setUser] = useState(null)
    const [tags, setTags] = useState([])
    const navigate = useNavigate()

    const goToAnswerPage = () => {
        navigate(`/home/${user.firstname}/${question._id}`)
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
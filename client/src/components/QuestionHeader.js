import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const QuestionHeader = (props) => {
    const {user} = useUser()
    const [questionCount, setQuestionCount] = useState(0)
	const navigate = useNavigate()

    const goToNewQuestionPage = () => {
        navigate(`/home/${user.firstName}/new_question`)
    }

    useEffect(() => {
        setQuestionCount(props.questionCount)
    }, [props.questionCount])

	return (
        <>
            <div>
                <div className="head">
                    <h1> All questions </h1>
                    {user && !user.isGuest && <button name="questions" type="button" onClick={goToNewQuestionPage}> Ask question </button>}
                </div>

                <div className="qfunc">
                    <p> {questionCount} questions </p>
                    <button id="new" name="newest" type="button" > Newest </button>
                    <button id="active" name="active" type="button" > Active </button>
                    <button id="unanswered" name="unanswered" type="button" > Unanswered </button>
                </div>
            </div>
        </>
    );
}
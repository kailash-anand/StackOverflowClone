import React from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export const QuestionHeader = () => {
	const {user} = useUser()
	const navigate = useNavigate()


	return (
        <>
            <div>
                <div className="head">
                    <h1> All questions </h1>
                    {user && !user.isGuest && <button name="questions" type="button" > Ask question </button>}
                </div>

                <div className="qfunc">
                    <p> questions </p>
                    <button id="new" name="newest" type="button" > Newest </button>
                    <button id="active" name="active" type="button" > Active </button>
                    <button id="unanswered" name="unanswered" type="button" > Unanswered </button>
                </div>
            </div>
        </>
    );
}
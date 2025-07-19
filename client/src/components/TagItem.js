import React, { useEffect, useState } from "react";
import { getTagQuestionCount } from "../api/TagServlet";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const TagItem = (props) => {
	const tag = props.tag
	const {user} = useUser()
	const [questioncount, setQuestionCount] = useState(0)
	const navigate = useNavigate()

	const goToHomePage = () => {
		const queryParams = new URLSearchParams({tag: tag._id})
		navigate(`/home/${user.firstName}?${queryParams.toString()}`)
	}	

	useEffect(() => {
		const getDisplayTagQuestionCount = async () => {
			try {
				const response = await getTagQuestionCount(tag._id)
				setQuestionCount(response.data)
			}
			catch (err) {
				setQuestionCount(0)
			}
		}

		getDisplayTagQuestionCount()
	})

	return (
        <div className="tagBox">
            <a className="taglink" href="#" onClick={goToHomePage}>
                {tag.name}
            </a>
            <p className="tagcount">
                {questioncount} questions
            </p>
        </div>
    );
}
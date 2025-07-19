import React, { useEffect, useState } from "react";
import { getTagsCount } from "../api/TagServlet";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


export const TagsHeader = () => {
	const {user} = useUser()
	const [tagsCount, setTagsCount] = useState(0)
	const navigate = useNavigate()

	const goToNewQuestionPage = () => {
		navigate(`/home/${user.firstName}/new_question`)
	}

	useEffect(() => {
		const getNoOfTags = async () => {
			try {
				setTagsCount((await getTagsCount()).data)
			}
			catch (err) {
				setTagsCount(0)
			}
		}

		getNoOfTags()
	})

	return (
        <>
            <div>
                <div className="main">
                    <h1 className="var_tags"> {tagsCount} Tags </h1>
                    <h1 className="all_tags"> All Tags </h1>
					{user && !user.isGuest && <button name="questions" type="button" onClick={goToNewQuestionPage}> Ask question </button>}
                </div>
            </div>
        </>
    );
}
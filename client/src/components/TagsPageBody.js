import React, { useEffect, useState } from "react";
import { TagsHeader } from "./TagsHeader";
import { toast } from "react-toastify";
import { getAllTags } from "../api/TagServlet";
import { TagItem } from "./TagItem";

export const TagsPageBody = () => {
	const [tags, setTags] = useState([])

	useEffect(() => {
		const getDisplayTags = async () => {
			try {
				const response = await getAllTags()
				setTags(response.data)
			}
			catch (err) {
				toast.error("Could not get tags")
			}
		}

		getDisplayTags()
	})

	return (
		<>
			<TagsHeader />
			<div className="tagContainer2">
				<div className="tagContainer2">
					{tags.map((tag) => (
						<TagItem key={tag._id} tag={tag}/>
					))}
				</div>
        	</div>
		</>
	)
}
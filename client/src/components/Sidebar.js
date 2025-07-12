import React from "react";

export const Sidebar = () => {

	const clickedOuestion = () => {
		
	}   
	 
	const navigatehome = () => {
		
	}

	return (
		<div className="sidebar">
			<button type="button" onClick={clickedOuestion} className="question" >
				<h2> Questions </h2>
			</button>
			<button type="button" onClick={navigatehome} className="tags">
				<h2> Tags </h2>
			</button>
		</div>
	);
}
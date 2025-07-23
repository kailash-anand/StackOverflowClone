import React from "react";


export const QuestionDetail = () => {
    <div className="mainContent">
        <div className="questionDetails">
            <h1 className="questionTitle">{currentQuestion.title}</h1>
            <div className="stats">
                <p className="answersCount"><strong>Answers:</strong> {currentQuestion.answers.length}</p>
                <p className="viewsCount"><strong>Views:</strong> {currentQuestion.views}</p>
                <p className="votesCount"><strong>Votes:</strong> {currentQuestion.votes}</p>
            </div>
            <h3 className="subheading">Text:</h3>
            <p className="questionText">{currentQuestion.text}</p>
            <h3 className="subheading">Tags:</h3>
            <div className="tagsContainer">
                {tags.map(tag => <span key={tag._id} className="tag">{tag.name}</span>)}
            </div>
            <h3 className="subheading">Asked by:</h3>
            <div className="askedBy">
                <p className="username">{getUser(currentQuestion.askedBy).first_name + " " + getUser(currentQuestion.askedBy).last_name}</p>
                <p className="date">{findDate(new Date(currentQuestion.ask_date_time))}</p>
            </div>
            <div className="VotesContainer">
                {props.data.currentUser ? (
                <>
                    <h1>Vote</h1>
                    <button key="upvote" onClick={incVote()}>Upvote</button>
                    <button key="downvote" onClick={decVote()}>Downvote</button>
                </>
                ) : (
                <div></div>
                )}
          </div>
        </div>
    </div>
}
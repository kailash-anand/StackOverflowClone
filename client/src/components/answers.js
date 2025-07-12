import React from "react";
import { Header,Sidebar } from "./headerAndSidebar";
import '../stylesheets/answers.css';
import {useState} from "react";
import axios from 'axios';

let model = null;

export const DisplayQuestionDetails = (props) => {
    model = JSON.parse(JSON.stringify(props.data));

    const currentQuestion = JSON.parse(localStorage.getItem("currentQuestion"));
    const [currentPage, setCurrentPage] = React.useState(0);
    const [commentPages, setCommentPages] = React.useState({});
    //const [commentPagesA, setCommentPagesA] = React.useState({});
    const [showCommentForm, setShowCommentForm] = useState(false); // Correctly initialized here
    const [showCommentFormA, setShowCommentFormA] = useState(false);
    const [currentCommentPage, setCurrentCommentPage] = useState(0);
    const [findAnsId, setAnsId] = useState(0);
    // state to hold the new comment text
    const [text, setText] = React.useState("");
  
    const [textAc, setTextAc] = React.useState("");

    const pageSize = 5;
    const commentPageSize = 3;
    const tags = currentQuestion.tags.map(tagId => getTag(tagId));
    const comments = currentQuestion.comments.map(commentId => getComment(commentId));
    const commentsA = currentQuestion.answers?.reduce((acc, answer) => {
      const answerComments = answer.comments?.map(commentId => getComment(commentId)) || [];
      return [...acc, ...answerComments];
  }, []);
    const answers = currentQuestion.answers.map(answerId => getAnswer(answerId)).sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
    const numOfPages = Math.ceil(answers.length / pageSize);
    
    const numOfCommentPages = Math.ceil(comments.length / commentPageSize);
    const numOfCommentPagesA = Math.ceil(commentsA.length / commentPageSize);
    const displayedComments = comments
  .slice(currentCommentPage * commentPageSize, (currentCommentPage + 1) * commentPageSize)
  .sort((a, b) => new Date(a.ask_date_time) - new Date(b.ask_date_time));
    // const displayedCommentsA = commentsA.slice(
    //   commentPagesA * commentPageSize,
    //   (commentPagesA + 1) * commentPageSize
    // );

    const handleNext = () => {
      if (currentPage < numOfPages - 1) {
          setCurrentPage(currentPage + 1);
      }
  };

  const handlePrev = () => {
      if (currentPage > 0) {
          setCurrentPage(currentPage - 1);
      }
  };

    const handleCommentNextQ = () => {
      if (currentCommentPage < numOfCommentPages - 1) {
        setCurrentCommentPage(prev => prev + 1);
    }
    };

    const handleCommentPrevQ = () => {
      if (currentCommentPage > 0) {
        setCurrentCommentPage(prev => prev - 1);
    }
    };

  //   const handleCommentNextA = (answerId) => {
  //     setCommentPagesA(prev => ({
  //       ...prev,
  //       [answerId]: ((prev[answerId] || 0) + 1)
  //   }));
  // };

  // const handleCommentPrevA = (answerId) => {
  //   setCommentPagesA(prev => ({
  //     ...prev,
  //     [answerId]: Math.max(0, (prev[answerId] || 0) - 1)
  // }));
  // };



     

    const addComment = async () => {
      const commentData = {
        text: text,
        authorId: model.currentUser._id,
        ask_date_time: Date.now(),
        votes: 0
      };
    
      try {
        console.log("This is author id: ", model.currentUser._id);
        const response = await axios.post('http://localhost:8000/api/comments', commentData);
        const newCommentId = response.data._id; // Assuming the server returns the ID of the newly created comment
        await axios.put(`http://localhost:8000/api/questions/${currentQuestion._id}/comments`, {
        commentId: newCommentId
        });
        setText("");
        //////////////
        /////////////
        /////////////
        //CHANGE HERE PAGE
        props.setPage(3);
        /////////////
        ////////////
        //////////////
        props.setData(null);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };

    const incVote = () => {

    };

    const decVote = () => {

    };
    

    return (
        <>
            <Header page={props.page} setPage={props.setPage} data={props.data} setData={props.setData}/>
            <Sidebar page={props.page} setPage={props.setPage} data={props.data} setData={props.setData}/>
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
                    <h3 className="subheading">Comments:</h3>
                    <div className="commentsContainer">
                        {displayedComments.map((comment, index) => (
                            <div key={index} className="comment">
                                <span className="commentText">{comment.text} - </span>
                                <span className="commentAuthor"><strong>by {getUser(comment.authorId).first_name}</strong></span>
                                <span className="commentDate"> on {findDate(new Date(comment.ask_date_time))}</span>
                            </div>
                        ))}
                        <div className="pagination">
                          <button onClick={handleCommentPrevQ} disabled={currentCommentPage === 0 || comments.length<=3} >Prev</button>
                          <button onClick={handleCommentNextQ} disabled={currentCommentPage === numOfCommentPages - 1 || comments.length <= 3}>Next</button>
                        </div>
                        <div>
                            {props.data.currentUser ? (
                                <button className="addCommentBtn" onClick={() => setShowCommentForm(true)}>Add Comment</button>
                            ) : (
                                <div></div>
                            )}
                        </div>
                        {showCommentForm && (
                            <div className="commentForm">
                                <textarea maxLength="140" placeholder="Write your comment here..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
                                <button onClick={addComment}>Comment</button>
                                <button onClick={() => setShowCommentForm(false)}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
                  <h2 className="answersSubtitle">Answers</h2>
                  {DisplayAllAnswers(props, model, currentQuestion, currentPage, setCurrentPage)}
                
                    
            </div>
        </>
);
}

const DisplayAllAnswers = (props, model, currentQuestion, currentPage, setCurrentPage) => {
  const pageSize = 5;
  const answers = currentQuestion.answers
      .map(answerId => getAnswer(answerId))
      .sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
  const [textA, setTextA] = React.useState("");
  const [showAnswerForm, setShowAnswerForm] = React.useState(false);
  const numOfPages = Math.ceil(answers.length / pageSize);
  const displayedAnswers = answers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const handleNext = () => {
    if (currentPage < numOfPages - 1) {
        setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
    }
  };
  const answerQuestion = async () => {
      try {
        const answerData = {
          
            text: textA, // Replace with the actual answer text
            ans_by: model.currentUser._id, // Assuming you have the current user ID
            ans_date_time: Date.now(), // Assuming you want to use the current date/time
            votes: 0 // You can set initial votes to 0 or any default value
          
        };
    
        // Make PUT request to add answer
        const response = await axios.post(`http://localhost:8000/api/answers`, answerData);
        const newAnswerId = response.data._id;
        console.log("This is current question id: \n", currentQuestion._id);
        console.log("This is answer id: \n", newAnswerId);
        await axios.put(`http://localhost:8000/api/questions/${currentQuestion._id}/answers`, {
        answerId: newAnswerId
        });
        console.log("Reached here!");
        // Handle response (optional)
        setTextA("");
        props.setPage(3);
        props.setData(null);
        // Optionally, you can update the state or perform other actions after adding the answer
      } catch (error) {
        console.error("Error adding answer:", error);
      }
    }
  return (
      <>
          {displayedAnswers.map(answer => (
              <AnswersList props={props} answer={answer} key={answer._id} />
          ))}
          <div className="pagination">
              <button onClick={handlePrev} disabled={currentPage === 0 || answers.length <= pageSize}>Prev</button>
              <button onClick={handleNext} disabled={(currentPage === numOfPages - 1) || answers.length <= pageSize}>Next</button>
          </div>
          
          {showAnswerForm && (
            <div className="answerForm">
              <textarea maxLength="500" placeholder="Write your answer here..." value={textA} onChange={(e) => setTextA(e.target.value)}></textarea>
              <button onClick={answerQuestion}>Post</button>
              <button onClick={() => setShowAnswerForm(false)}>Cancel</button>
            </div>
          )}
          {props.data.currentUser ? (<button className="answerQuestionBtn" onClick={
            () => setShowAnswerForm(true)}>Answer Question</button>) : (<div></div>)}
      </>
  );
};

const AnswersList = ({ props, answer, setPage, setData }) => {

  const [commentPagesA, setCommentPagesA] = React.useState({});
  const [showCommentFormA, setShowCommentFormA] = React.useState(false);
  const [textAc, setTextAc] = React.useState("");
  const commentPageSize = 3;

  const handleCommentNextA = (answerId) => {
    setCommentPagesA(prev => ({
      ...prev,
      [answerId]: ((prev[answerId] || 0) + 1)
  }));
};

const handleCommentPrevA = (answerId) => {
  setCommentPagesA(prev => ({
    ...prev,
    [answerId]: Math.max(0, (prev[answerId] || 0) - 1)
}));
};
const addCommentA = async (answerId) => {
  const commentData = {
    text: textAc,
    authorId: model.currentUser._id,
    ask_date_time: Date.now(),
    votes: 0
  };
  console.log("This is answer ID: ", answerId);
  try {
    const response = await axios.post('http://localhost:8000/api/comments', commentData);
    const newCommentId = response.data._id; // Assuming the server returns the ID of the newly created comment
    await axios.put(`http://localhost:8000/api/answers/${answerId}/comments`, {
    commentId: newCommentId
    });
    setTextAc("");
    props.setPage(3);
    props.setData(null);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
 };


  return (
    <div key={answer._id} className="answer">
        <p className="answerText">{answer.text}</p>
        <div className="answerFooter">
          <span className="answerVotes">{answer.votes} Votes</span>
            <span className="answerDetails">
            <span className="answerAuthor">{getUser(answer.ans_by).first_name} {getUser(answer.ans_by).last_name}</span>
            <span className="answerDate">{findDate(new Date(answer.ans_date_time))}</span>
          </span>
        </div>
        <h3 className="subheadingA">Comments:</h3>
        <div className="commentsContainerA">
        {answer.comments
  .map(commentId => getComment(commentId)) // Convert IDs to comment objects
  .reverse() // Reverse the array to start from the last element
  .slice((commentPagesA[answer._id] || 0) * commentPageSize, ((commentPagesA[answer._id] || 0) + 1) * commentPageSize) // Paginate the comments
  .map(comment => {
    return (
      <div key={comment._id} className="commentA">
        <p className="commentText">{comment.text} - <strong>by {getUser(comment.authorId).first_name}</strong> on {findDate(new Date(comment.ask_date_time))}</p>
      </div>
    );
  })}




          <div className="paginationAc">
            {props.data.currentUser ? (<button className="addCommentBtn" onClick={() => setShowCommentFormA(true)}>Add Comment</button>) : (<div></div>)}
            <div>
            <button onClick={() => handleCommentPrevA(answer._id)} disabled={(commentPagesA[answer._id] < 1) || (answer.comments.length <= 3)}>Prev</button>
            <button onClick={() => handleCommentNextA(answer._id)} disabled={commentPagesA[answer._id] >= Math.ceil(answer.comments.length / commentPageSize) - 1 || answer.comments.length <= commentPageSize}>Next</button>
            </div>
          </div>
          {showCommentFormA && (
          <div className="commentForm">
            <textarea maxLength="140" placeholder="Write your comment here..." value={textAc} onChange={(e) => setTextAc(e.target.value)}></textarea>
            <button onClick={() => addCommentA(answer._id)}>Comment</button>
            <button onClick={() => setShowCommentFormA(false)}>Cancel</button>
          </div>
        )}
        </div>
    </div>
  );
};

function sortByDate(list) {
  list.sort((a, b) => new Date(getAnswer(b._id).ans_date_time) - new Date(getAnswer(a._id).ans_date_time));
}

function findDate(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
  
    if (days < 1) {
      if (hours < 1) {
        if (minutes < 1) {
          return seconds + " seconds ago";
        } else {
          return minutes + " minutes ago";
        }
      } else {
        return hours + " hours ago";
      }
    } else if (days < 2) {
      return `${month} ${dayOfMonth} at ${hour}:${minute}`;
    } else {
      return `${month} ${dayOfMonth}, ${year} at ${hour}:${minute}`;
    }
}

function getTag(tid) {
    return model.tags.find(tag => tag._id === tid); 
}

function getUser(uid) {
    return model.users.find(user => user._id === uid);
}

function getComment(cid) {
    return model.comments.find(comment => comment._id === cid);
}

function getAnswer(aid) {
  return model.answers.find(ans => aid === ans._id);
}


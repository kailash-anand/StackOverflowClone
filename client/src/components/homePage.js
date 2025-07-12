import React from 'react';
import axios from 'axios';
import '../stylesheets/homePage.css';
import { Header, Sidebar } from './headerAndSidebar';
import { Head } from './bodyHeader';

let model = null;

export const HomePage = (props) => {

  model = props.data;
  const [state, selectState] = React.useState(0);
  const [pageIndex, setPageIndex] = React.useState(0);  

  const questionsPerPage = 5;
  const numPages = Math.ceil(model.questions.length / questionsPerPage);

  const handleNext = () => {
    if (pageIndex < numPages - 1) setPageIndex(pageIndex + 1);
  };

  const handlePrev = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
  };

  return (
    <>
      <Header page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
      <Sidebar page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
      <Head page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} state={state} selectState={selectState}/>
      {displayAllQuestions(state, props, pageIndex, questionsPerPage)}
      <div className='pagination-buttons'>
        <button onClick={handlePrev} disabled={pageIndex === 0}>Prev</button>
        <button onClick={handleNext} disabled={pageIndex === numPages - 1}>Next</button>
      </div>
    </>
  );
}

const displayAllQuestions = (state, props, pageIndex, questionsPerPage) => {
  let questions = model.questions;

  if (state === 0) {
    sortByDate(questions);
  }

  if (state === 1) {
    questions.sort((a, b) => {
      const latestAnswerA = findlatestAnswer(a, model);
      const latestAnswerB = findlatestAnswer(b, model);

      if (latestAnswerA && latestAnswerB) {
        return new Date(latestAnswerB.ans_date_time) - new Date(latestAnswerA.ans_date_time);
      } else if (latestAnswerA) {
        return -1;
      } else if (latestAnswerB) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  if (state === 2) {
    questions = questions.filter(question => question.answers.length === 0);
  }


  const start = pageIndex * questionsPerPage;
  const end = start + questionsPerPage;
  const questionsToShow = questions.slice(start, end);

  return (
    <>
      {questionsToShow.map((question) => (
        <DisplayQuestion question={question} model={model} props={props} key={question._id} />
      ))}
    </>
  );
};

const DisplayQuestion = ({ question, model, props }) => {
  return (
    <div className="container2">
      <pre className="left">
        {getAnsPerQuestion(question) + " answers\n" + question.views + " views\n" + question.votes + " votes"}
      </pre>
      <a className="middle" href="#" onClick={uploadQuestion.bind(null, question, props)}>
        {question.title}
      </a>
      <p className="right">
        <span className="askedBy">{getUser(question.askedBy).first_name + " " +getUser(question.askedBy).last_name}</span>
        <span className="askDate"> asked {findDate(new Date(question.ask_date_time))}</span>
      </p>
      <p className='summary'>
        {"Summary: " + question.summary}
      </p>
      <TagDisplay question={question} model={model} />
    </div>
  );
};

const TagDisplay = ({ question, model }) => {
  return (
    <div className="tagContainer">
      {question.tags.map((tagId) => {
        const tag = getTag(tagId);
        return (
          <p className="bottom" key={tagId}>
            {tag}
          </p>
        );
      })}
    </div>
  );
};


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

function sortByDate(list) {
  list.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
}

function findlatestAnswer(question, model) {

  let latestAnswer = null;

  question.answers.forEach(ans => {
    const ans2 = getAnswer(ans._id);
    if (!latestAnswer || new Date(ans2.ans_date_time) > new Date(latestAnswer.ans_date_time)) {
      latestAnswer = ans2;
    }
  });

  return latestAnswer;
}

// function uploadQuestion(question, props) {
//   question.views++;
//   model.questions.find(qtn => qtn._id === question._id).views = question.views;
//   localStorage.setItem("currentQuestion", JSON.stringify(question));
//   props.setPage(5);
// }

async function uploadQuestion(question, props) {
  try {
    // Increment views count in the database
    const updatedQuestion = await axios.put(`http://localhost:8000/api/questions/${question._id}`, {
      ...question,
      views: question.views + 1 // Increment views count by 1
    });

    // Update the currentQuestion in localStorage
    localStorage.setItem("currentQuestion", JSON.stringify(updatedQuestion.data));

    // Update the question views in the model
    const index = model.questions.findIndex(qtn => qtn._id === question._id);
    if (index !== -1) {
      model.questions[index].views = updatedQuestion.data.views;
    }

    // Navigate to page 5
    props.setPage(5);
  } catch (error) {
    console.error("Error uploading question:", error);
  }
}


function getAnsPerQuestion(q) {
  return q.answers.length;
}

function getTag(tagId) {
  if (model.tags.find(tag => tag._id === tagId) === undefined) {
    return;
  }

  return model.tags.find(tag => tag._id === tagId).name;
}

function getAnswer(aid) {
  return model.answers.find(ans => aid === ans._id);
}

function getUser(uid) {
  return model.users.find(user => user._id === uid);
}
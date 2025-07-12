import React from 'react';
import axios from 'axios';
import '../stylesheets/user.css';
import { Header } from './headerAndSidebar';
import { Sidebar } from './headerAndSidebar';

let model = null;

export const User = (props) => {

    const [view, setView] = React.useState('questions');

    model = JSON.parse(JSON.stringify(props.data));

    if (props.data.tempUser !== null) {
        model.currentUser = JSON.parse(JSON.stringify(props.data.tempUser));
    }
    else {
        model.currentUser = JSON.parse(JSON.stringify(props.data.currentUser));
    }

    const backToAdmin = () => {
        props.data.tempUser = null;
        props.setPage(7);
    }

    console.log(model);

    return (
        <>
            <Header page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
            <Sidebar page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
            <div className='main-content3'>
                <div className='user-info'>
                    <h2> {model.currentUser.first_name + " " + model.currentUser.last_name} </h2>
                    <p> {"Member for "} </p>
                    <p> {"Reputation: " + model.currentUser.reputation} </p>
                    {props.data.tempUser !== null && <button onClick={backToAdmin}> Back </button>}
                </div>
                <div className='view-selection'>
                    <button onClick={() => setView('questions')}>Questions</button>
                    <button onClick={() => setView('tags')}>Tags</button>
                    <button onClick={() => setView('answers')}>Answers</button>
                    {model.currentUser.isAdmin && <button onClick={() => setView('users')}>Users</button>}
                </div>
                <h2>{view.charAt(0).toUpperCase() + view.slice(1)}:</h2>
                {view === 'questions' && displayUserQuestions(props)}
                {view === 'tags' && displayTags(props)}
                {view === 'answers' && displayUserAnswers(props)}
                {view === 'users' && displayAllUsers(props, setView)};
            </div>
        </>
    );
}

const displayUserQuestions = (props) => {
    let userQuestions = model.questions.filter(qst => qst.askedBy === model.currentUser._id);

    return (
        <>
            {userQuestions.map(question =>
                <DisplayQuestionTitle question={question} props={props} key={question._id} />
            )}
        </>
    );
}

const DisplayQuestionTitle = ({ question, props }) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);


    const editQuestion = () => {
        props.data.currentEditQuestion = question;
        props.setPage(4);
    }

    const deleteQuestion = () => {
        setShowConfirmation(true);
    }

    const handleConfirmDelete = async () => {
        try {

            for (const commentId of question.comments) {
                console.log(commentId);
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
            }


            for (const answerId of question.answers) {
                await axios.delete(`http://localhost:8000/api/answers/${answerId}`);

                const ans = getAnswer(answerId);

                for (const commentId of ans.comments) {
                    await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
                }
            }


            await axios.delete(`http://localhost:8000/api/questions/${question._id}`);

            props.setData(null);
            props.setPage(7);
        } catch (error) {
            console.error("Error deleting question:", error);
        }
        setShowConfirmation(false);
    }

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    }

    return (
        <div className="container4">
            <a className="middle2" href='#' onClick={editQuestion} >
                {question.title}
            </a>
            <button className="delete-button" onClick={deleteQuestion}>Delete</button>
            {showConfirmation && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete?</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}
        </div>
    );
};

const displayUserAnswers = (props) => {

    const userAnsweredQuestions = model.questions.filter(question =>
        question.answers.some(answer => {
            return getAnswer(answer).ans_by === model.currentUser._id;
        })
    );

    return (
        <>
            {userAnsweredQuestions.map(question => (
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
                <span className="askedBy">{getUser(question.askedBy).first_name + " " + getUser(question.askedBy).last_name}</span>
                <span className="askDate"> asked {findDate(new Date(question.ask_date_time))}</span>
            </p>
            <p className='summary'>
                {"Summary: " + question.summary}
            </p>
            <TagDisplay question={question} model={model} />
        </div>
    );
};

const displayTags = (props) => {
    let tags = model.tags.filter(tag => tag.createdBy === model.currentUser._id);
    return (
        <div className="tagContainer2">
            {tags.map((tags) => (
                <DisplayTag key={tags._id} tags={tags} props={props} />
            ))}
        </div>
    );
}

const DisplayTag = ({ tags, props }) => {
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [editedTagName, setEditedTagName] = React.useState(tags.name);
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [error, setError] = React.useState('');

    const deleteTag = async () => {
        let count = getCountPerTag(tags._id);

        if (count > 0) {

            model.questions.forEach(async (question) => {
                const tagIndex = question.tags.indexOf(tags._id);
                if (tagIndex !== -1) {
                    question.tags.splice(tagIndex, 1);

                    await axios.put(`http://localhost:8000/api/questions/${question._id}`, {
                        ...question,
                        tags: question.tags
                    });
                }
            });
        }

        await axios.delete(`http://localhost:8000/api/tags/${tags._id}`);

        props.setData(null);
        props.setPage(7);
    }

    const handleEditTag = () => {
        setShowEditModal(true);
    };

    const handleDeleteTag = () => {
        setShowConfirmation(true);
    }

    const handleConfirmDelete = async () => {
        await deleteTag();
        setShowConfirmation(false);
    }

    const handleConfirmEdit = async () => {
        if (!editedTagName.trim() || editedTagName.includes(' ')) {
            setError('Tag name cannot be empty or contain spaces.');
        } else {
        try {
            await axios.put(`http://localhost:8000/api/tags/${tags._id}`, { name: editedTagName, createdBy: model.currentUser._id });

            setShowEditModal(false);
            props.setData(null);
            props.setPage(7);

        } catch (error) {
            console.error("Error updating tag:", error);
        }
    }
    };

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    }

    const handleCancelEdit = () => {
        setShowEditModal(false);
    };

    return (
        <div className="tagBox2">
            <p className="taglink" >
                {tags.name}
            </p>
            <p className="tagcount">
                {getCountPerTag(tags._id)} questions
            </p>
            <button className="edit-button" onClick={handleEditTag}>Edit</button>
            <button className="delete-button" onClick={handleDeleteTag}>Delete</button>
            {showEditModal && (
                <div className="edit-modal">
                    <p>Edit Tag Name:</p>
                    <input
                        type="text"
                        value={editedTagName}
                        onChange={e => setEditedTagName(e.target.value)}
                    />
                    <button onClick={handleConfirmEdit}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                    {error && <div className="error-message">{error}</div>}
                </div>
            )}
            {showConfirmation && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete?</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}

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

const displayAllUsers = (props, setView) => {
    let users = props.data.users.filter(user => !user.isAdmin);

    return (
        <>
            {users.map(user => (
                <DisplayUser user={user} props={props} key={user._id} setView={setView} />
            ))}
        </>
    );
}

const DisplayUser = ({ user, props, setView }) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    const directToUserPage = () => {
        props.data.tempUser = user;
        setView('questions');
    }

    const handleConfirmDelete = async () => {
        await deleteUser();
        setShowConfirmation(false);
    }

    const handleCancelDelete = () => {
        setShowConfirmation(false);
    }

    const handleDeleteUser = () => {
        setShowConfirmation(true);
    }

    const deleteUser = async () => {
        console.log(`Starting deletion for user ${user._id}`);

        // Deleting questions and their associated answers and comments
        const userQuestions = model.questions.filter(question => question.askedBy === user._id);
        console.log(`Found ${userQuestions.length} questions to delete`);
        for (const question of userQuestions) {
            console.log(`Deleting comments for question ${question._id}`);
            for (const commentId of question.comments) {
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
                console.log(`Deleted comment ${commentId}`);
            }
            console.log(`Deleting answers for question ${question._id}`);
            for (const answerId of question.answers) {
                const answer = getAnswer(answerId);
                console.log(`Deleting comments for answer ${answerId}`);
                for (const commentId of answer.comments) {
                    await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
                    console.log(`Deleted comment ${commentId} from answer ${answerId}`);
                }
                await axios.delete(`http://localhost:8000/api/answers/${answerId}`);
                console.log(`Deleted answer ${answerId}`);
            }
            await axios.delete(`http://localhost:8000/api/questions/${question._id}`);
            console.log(`Deleted question ${question._id}`);
        }

        // Deleting answers by the user on other questions and removing references
        const userAnswers = model.answers.filter(answer => answer.ans_by === user._id);
        console.log(`Found ${userAnswers.length} answers to delete`);
        for (const answer of userAnswers) {
            console.log(`Deleting comments for answer ${answer._id}`);
            for (const commentId of answer.comments) {
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
                console.log(`Deleted comment ${commentId} from answer ${answer._id}`);
            }
            const parentQuestion = model.questions.find(question => question.answers.includes(answer._id));
            if (parentQuestion) {
                console.log(`Removing answer ${answer._id} from question ${parentQuestion._id}`);
                const updatedAnswers = parentQuestion.answers.filter(id => id !== answer._id);
                await axios.put(`http://localhost:8000/api/questions/${parentQuestion._id}`, {
                    ...parentQuestion,
                    answers: updatedAnswers
                });
                console.log(`Updated question ${parentQuestion._id} after removing answer ${answer._id}`);
            }
            await axios.delete(`http://localhost:8000/api/answers/${answer._id}`);
            console.log(`Deleted answer ${answer._id}`);
        }

        // Deleting all comments made by the user and removing references
        const userComments = model.comments.filter(comment => comment.authorId === user._id);
        console.log(`Found ${userComments.length} comments to delete`);
        for (const comment of userComments) {
            const parentQuestion = model.questions.find(question => question.comments.includes(comment._id));
            const parentAnswer = model.answers.find(answer => answer.comments.includes(comment._id));
            if (parentQuestion) {
                console.log(`Removing comment ${comment._id} from question ${parentQuestion._id}`);
                const updatedComments = parentQuestion.comments.filter(id => id !== comment._id);
                await axios.put(`http://localhost:8000/api/questions/${parentQuestion._id}`, {
                    ...parentQuestion,
                    comments: updatedComments
                });
                console.log(`Updated question ${parentQuestion._id} after removing comment ${comment._id}`);
            } else if (parentAnswer) {
                console.log(`Removing comment ${comment._id} from answer ${parentAnswer._id}`);
                const updatedComments = parentAnswer.comments.filter(id => id !== comment._id);
                await axios.put(`http://localhost:8000/api/answers/${parentAnswer._id}`, {
                    ...parentAnswer,
                    comments: updatedComments
                });
                console.log(`Updated answer ${parentAnswer._id} after removing comment ${comment._id}`);
            }
            await axios.delete(`http://localhost:8000/api/comments/${comment._id}`);
            console.log(`Deleted comment ${comment._id}`);
        }

        // Deleting all tags created by the user
        const userTags = model.tags.filter(tag => tag.createdBy === user._id);
        console.log(`Found ${userTags.length} tags to delete`);
        for (const tag of userTags) {
            await axios.delete(`http://localhost:8000/api/tags/${tag._id}`);
            console.log(`Deleted tag ${tag._id} created by user`);
        }

        // Deleting the user
        await axios.delete(`http://localhost:8000/api/users/${user._id}`);
        console.log(`Deleted user ${user._id}`);
        props.setData(null);
        props.setPage(7);
    }

    return (
        <div className="container4">
            <a className="middle2" href='#' onClick={directToUserPage}>
                {user.first_name + " " + user.last_name}
            </a>
            <button className="delete-button" onClick={handleDeleteUser}>Delete</button>
            {showConfirmation && (
                <div className="confirmation-modal">
                    <p>Are you sure you want to delete?</p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}
        </div>
    );
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

function sortByDate(list) {
    list.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
}


function uploadQuestion(question, props) {
    question.views++;
    model.questions.find(qtn => qtn._id === question._id).views = question.views;
    localStorage.setItem("currentQuestion", JSON.stringify(question));
    props.setPage(5);
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

function getCountPerTag(_id) {
    let count = 0;
    model.questions.forEach(question => {
        // if(question.tags.find(tag => tag._id === _id))
        // {
        //   count++;
        // }
        if (question.tags.includes(_id)) {
            count++;
        }
    })

    return count;
}
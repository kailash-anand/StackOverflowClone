import React from "react";
import { useUser } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { addQuestion } from '../api/QuestionServlet';

export const NewQuestionForm = () => {
    const navigate = useNavigate()
    const user = useUser()

    let [title, setTitle] = React.useState("");
    let [summary, setSummary] = React.useState("");
    let [text, setText] = React.useState("");
    let [tags, setTags] = React.useState("");

    const validateForm = (data) => {
        const titleError = document.getElementById("titleError");
        const summaryError = document.getElementById('summaryError');
        const textError = document.getElementById("textError");
        const tagError = document.getElementById("tagError");

        const title = data.title;
        const summary = data.summary;
        const text = data.text;
        const tags = data.tags;

        const tagArray = tags.split(/\s+/)

        let check = false;
        const hyperlinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
        const invalidLinks = data.text.match(hyperlinkPattern) === null && data.text.includes('[') && data.text.includes(']') && data.text.includes('(') && data.text.includes(')');

        if (!title.trim()) {
            titleError.textContent = "Please enter a title";
            check = true;
        }
        else if (title.length > 100) {
            titleError.textContent = "Character length cannot exceed 100";
        }
        else { titleError.textContent = ""; }

        if (!text.trim()) {
            textError.textContent = "Please enter a text";
            check = true;
        }
        else if (invalidLinks) {
            textError.textContent = "Hyperlink must begin with 'http://' or 'https://'";
            check = true;
        } else {
            textError.textContent = "";
        }

        if (!summary.trim()) {
            summaryError.textContent = "Please enter a summary";
            check = true;
        }
        else if (summary.length > 140) {
            summary.textContent = "Character length cannot exceed 140";
        }
        else { summaryError.textContent = ""; }

        if (!tags.trim()) {
            tagError.textContent = "Please enter a tag";
            check = true;
        }
        else if (tagArray.length > 5) {
            tagError.textContent = "There cannot be more than 5 tags";
            check = true;
        }
        else { tagError.textContent = ""; }

        tagArray.forEach(tag => {
            if (tag.length > 20) {
                check = true;
                tagError.textContent = "One or more tags has more than 20 characters";
            }
        })

        if (check) {
            return -1;
        }
        else {
            return 0;
        }
    }

    const submitForm = async (event) => {
        event.preventDefault()
		console.log(user)

        const data = {
            title: title,
            summary: summary,
            text: text,
            tags: tags,
            askedBy: user.user.email,
            ask_date_time: new Date().getTime(),
        };

        if (validateForm(data) === -1) {
            return;
        }

		data.tags = tags.split(/\s+/).filter(tag => tag.trim() !== '')

        try {
            await addQuestion(data);
            navigate(`/home/${user.firstName}`)
        } catch (error) {
            console.error('Failed to post question:', error);
        }
    }

    return (
        <>
            <div className='qform'>
                <form method="get" target="_self" onSubmit={submitForm}>
                    <label htmlFor="qtitle" className="title"> Question Title <sup>*</sup> </label> <br />
                    <p className="helpText"> Limit title to 100 characters or less </p>
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} name="questionTitle" id="qtitle" placeholder="Input title" />  <br />
                    <p className="titleError" id="titleError"></p>
    
                    <label htmlFor="qtext" className="text"> Question Text <sup>*</sup> </label> <br />
                    <p className="helpText"> Add details </p>
                    <input type="text" value={text} onChange={(event) => setText(event.target.value)} name="questionText" id="qtext" placeholder="Input text" /> <br />
                    <p className="textError" id="textError"></p>
    
                    <label htmlFor='qsummary' className='summary2'> Question Summary <sup>*</sup></label> <br />
                    <p className='helpText'> Add a question summary </p>
                    <input type='text' value={summary} onChange={(event) => setSummary(event.target.value)} name='summaryText' id='qsummary' placeholder='Input summary'></input> <br />
                    <p className='summaryError' id='summaryError'></p>
    
                    <label htmlFor="qtag" className="tags"> Tags <sup>*</sup> </label> <br />
                    <p className="helpText"> Add keywords seperated by whitespace </p>
                    <input type="text" value={tags} onChange={(event) => setTags(event.target.value)} name="questionTags" id="qtag" placeholder="Input tags" /> <br />
                    <p className="tagError" id="tagError"></p>
    
                    <input type="submit" id="qsubmit" value="Post Question" />
                    <p className="mandatory"> <sup>*</sup> indicates mandatory fields </p>
                </form>
            </div>
        </>
    );
}
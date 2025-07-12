import React from 'react';
import axios from 'axios';
import { Header, Sidebar } from "./headerAndSidebar";
import '../stylesheets/newQuestion.css';

let model = null;

export const Questionsform = (props) => {

    model = props.data;

    let [title, setTitle] = React.useState("");
    let [summary, setSummary] = React.useState("");
    let [text, setText] = React.useState("");
    let [tags, setTags] = React.useState("");

    React.useEffect(() => {
        if (props.data.currentEditQuestion != null) {
            setTitle(props.data.currentEditQuestion.title || "");
            setSummary(props.data.currentEditQuestion.summary || "");
            setText(props.data.currentEditQuestion.text || "");
            const tagsString = props.data.currentEditQuestion.tags.map(tagId => getTag(tagId)).join(" ");
            setTags(tagsString);
        }
    }, [props.data.currentEditQuestion]);

    const submitForm = async (event) => {
        try {
            event.preventDefault();
            const data = [
                {
                    title: title,
                    summary: summary,
                    text: text,
                    tags: tags,
                },
            ];

            if (validateMandatoryFields(data[0]) === -1) {
                event.preventDefault();
                return;
            }

            let question;
            if (props.data.currentEditQuestion == null) {
                question = createQuestion(data[0], model);
            } else {
                question = {
                    ...props.data.currentEditQuestion, // Keep existing properties
                    ...data[0] // Update with new form data
                };
            }

            const inputTags = tags.split(/\s+/).filter(tag => tag.trim() !== '');

            // Fetch existing tags
            const existingTagsResponse = await axios.get('http://localhost:8000/api/tags');
            const existingTags = existingTagsResponse.data;

            // Determine which tags need to be added to the database
            const newTagNames = inputTags.filter(tag => !existingTags.some(et => et.name === tag));
            const newTags = newTagNames.map(tagName => ({ name: tagName, createdBy: model.currentUser._id }));

            console.log(newTags);

            const tagPromises = newTags.map(tag => {
                return axios.post('http://localhost:8000/api/tags', tag);
            });
            const responses = await Promise.all(tagPromises);
            const createdTags = responses.map(response => response.data);

            const fullTagObjects = inputTags.map(tag => existingTags.find(et => et.name === tag) || createdTags.find(ct => ct.name === tag));

            question.tags = fullTagObjects;

            // If it's a new question, use POST; otherwise, use PUT
            const requestMethod = props.data.currentEditQuestion == null ? axios.post : axios.put;

            // If it's an edit, include the question ID in the URL
            const requestURL = props.data.currentEditQuestion == null ? 'http://localhost:8000/api/questions' : `http://localhost:8000/api/questions/${props.data.currentEditQuestion._id}`;

            // Send the request to save/update the question
            await requestMethod(requestURL, question);


            setTitle("");
            setSummary("");
            setText("");
            setTags("");

            props.setPage(3);
            props.setData(null);
        }
        catch (error) {
            console.error('Error adding question:', error);
        }
    }

    return (
        <>
            <Header page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
            <Sidebar page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
            <div className='qform'>
                <form method="get" target="_self" onSubmit={submitForm} >

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

function validateMandatoryFields(data) {
    const titleError = document.getElementById("titleError");
    const summaryError = document.getElementById('summaryError');
    const textError = document.getElementById("textError");
    const tagError = document.getElementById("tagError");

    const title = data.title;
    const summary = data.summary;
    const text = data.text;
    const tags = data.tags;

    const tagArray = tags.split(/\s+/);

    let check = false;
    const hyperlinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    const invalidLinks = data.text.match(hyperlinkPattern) === null && data.text.includes('[') && data.text.includes(']') && data.text.includes('(') && data.text.includes(')');


    if (!title.trim()) {
        titleError.textContent = "Please enter a title";
        check = true;
    }
    else if (title.length > 50) {
        titleError.textContent = "Character length cannot exceed 50";
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

function createQuestion(data, tempModel) {
    const newQuestion = {
        title: data.title,
        summary: data.summary,
        text: data.text,
        tags: [],
        answers: [],
        askedBy: tempModel.currentUser._id,
        ask_date_time: new Date().getTime(),
        views: 0,
        votes: 0,
        comments: []
    }
    fillTags(newQuestion, data.tags, tempModel);

    return newQuestion;
}

function fillTags(question, tags, tempModel) {
    const tagsArray = tags.split(/\s+/);
    const filteredArray = tagsArray.filter(element => element.trim() !== '');
    const tagSet = new Set(filteredArray);

    tagSet.forEach(tag => {
        const existingTag = tempModel.tags.find(tagItem => tagItem.name === tag);
        if (existingTag !== undefined) {
            question.tags.push(existingTag);
        }
        else {
            const newTag = {
                name: tag,
                createdBy: model.currentUser._id
            }
            question.tags.push(newTag);
        }
    });
}

function getTag(tagId) {
    if (model.tags.find(tag => tag._id === tagId) === undefined) {
        return;
    }

    return model.tags.find(tag => tag._id === tagId).name;
}
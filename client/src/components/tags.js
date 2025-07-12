import React from "react";
import { Header, Sidebar } from "./headerAndSidebar";
//import { Questionsform } from "./newQuestion";
import { TagsHead } from "./tagshead.js";
import '../stylesheets/tags.css'
//import questions from "../../../server/models/questions.js";

let model = null;

export const Tagspage = (props) => {

    model = props.data;
 
    return (
        <>
            <Header page={props.page} setPage={props.setPage} data={props.data} setData={props.setData}/>
            <Sidebar page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} />
            <TagsHead page={props.page} setPage={props.setPage} data={props.data} setData={props.setData} model={model}/>
            <div className="tagContainer2">{displayAllTags(props)}</div>
        </>
    );
}
    
const DisplayTag = ({ tags, props }) => {

    const clickedTag = () => {
        localStorage.setItem("searchQuery", "[" + tags.name + "]");
        props.setPage(8);
    }

    return (
        <div className="tagBox">
            <a className="taglink" href="#" onClick={clickedTag}>
                {tags.name}
            </a>
            <p className="tagcount">
                {getCountPerTag(tags._id)} questions
            </p>
        </div>
    );
};

const displayAllTags = (props) => {
    let tags = model.tags;
    return (
        <div className="tagContainer2">
            {tags.map((tags) => (
                <DisplayTag key={tags._id} tags={tags} props={props} />
            ))}
        </div>
    );
};


function getCountPerTag(_id)
{
  let count = 0;
  model.questions.forEach(question => {
    // if(question.tags.find(tag => tag._id === _id))
    // {
    //   count++;
    // }
    if(question.tags.includes(_id)){
        count++;
    }
  })

  return count;
}
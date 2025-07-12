import React from "react";
import '../stylesheets/questions.css';

let model = null;

export const TagsHead = (props) => {

    model = props.model;
    
    return (
        <>
            <div>
                <div className="main">
                    <h1 className="var_tags"> {countTags(props)} Tags </h1>
                    <h1 className="all_tags"> All Tags </h1>
                </div>
            </div>
        </>
    );
}

function countTags(){
    return model.tags.length;
}
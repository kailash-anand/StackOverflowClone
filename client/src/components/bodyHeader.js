import React from "react";
import '../stylesheets/bodyHeader.css';

export const Head = (props) => {
    const [ansbtn, setansbtn] = React.useState(false);

    const switchVal = () => {
        props.data.currentEditQuestion = null;
        props.setPage(4);
    }

    const switchToNewest = () => props.selectState(0);

    const switchToActive = () => props.selectState(1);

    const switchToUnanswered = () => props.selectState(2);

    const getCount = (props) => {
        
        if(ansbtn === true){
            return countUnanswered(props);
        }
        else{
            return countQuestions(props);
        }
    };

    if(props.data.currentUser === null)
    {
        return (
            <>
                <div>
                    <div className="head">
                        <h1> All questions </h1>
                    </div>
    
                    <div className="qfunc">
                        <p> {getCount(props)} questions </p>
                        <button id="new" name="newest" type="button" onClick={() => {switchToNewest(); setansbtn(false);}} > Newest </button>
                        <button id="active" name="active" type="button" onClick={() => {switchToActive(); setansbtn(false);}}> Active </button>
                        <button id="unanswered" name="unanswered" type="button" onClick= {() => {switchToUnanswered(); setansbtn(true);}}> Unanswered </button>
                    </div>
                </div>
            </>
        );
    }
    else
    {
        return (
            <>
                <div>
                    <div className="head">
                        <h1> All questions </h1>
                        <button name="questions" type="button" onClick={switchVal}> Ask question </button>
                    </div>
    
                    <div className="qfunc">
                        <p> {getCount(props)} questions </p>
                        <button id="new" name="newest" type="button" onClick={switchToNewest} > Newest </button>
                        <button id="active" name="active" type="button" onClick={switchToActive}> Active </button>
                        <button id="unanswered" name="unanswered" type="button" onClick={switchToUnanswered}> Unanswered </button>
                    </div>
                </div>
            </>
        );
    }
}

function countQuestions(props)
{
    return props.data.questions.length;
}


function countUnanswered(props) {
    return props.data.questions.filter(question => question.answers.length === 0).length;
}        


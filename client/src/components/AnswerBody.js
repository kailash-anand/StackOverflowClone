import React from "react";
import { QuestionDetail } from "./QuestionDetail";
import { useParams } from "react-router-dom";

export const AnswerBody = () => {
    const params = useParams()
    


    return (
        <>
            <QuestionDetail />
            <AnswerBody />
        </>
    )
}
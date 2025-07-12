import React from "react";
import '../stylesheets/headerAndSidebar.css';

export const Header = (props) => {

    const [searchData, setSearchData] = React.useState("");

    const filledSearch = (event) => {
        event.preventDefault();
        localStorage.setItem("searchQuery", searchData);
        props.setPage(8);
    }

    if(props.data.currentUser != null && props.page != 7 )
    {
        return (
            <div className="header">
                <a href="#" onClick={() => (props.setPage(7))} className="profile-icon">👤 Profile</a>
                <h1>
                    Fake Stack Overflow
                </h1>
                <form className="search_form" onSubmit={filledSearch}>
                    <input type="text" placeholder="Search..." className="search" onChange={(event) => setSearchData(event.target.value)}></input>
                </form>
            </div>
        );
    }
    else
    {
        return (
            <div className="header">
                <h1>
                    Fake Stack Overflow
                </h1>
                <form className="search_form" onSubmit={filledSearch}>
                    <input type="text" placeholder="Search..." className="search" onChange={(event) => setSearchData(event.target.value)}></input>
                </form>
            </div>
        );
    }
}

export const Sidebar = (props) => {

    const clickedOuestion = () => {
        props.data.tempUser = null;
        props.setPage(3);
    }    
    const navigatehome = () => {
        props.data.tempUser = null;
        props.setPage(6);

    }
    return (
        <div className="sidebar">
            <button type="button" onClick={clickedOuestion} className="question" >
                <h2>
                    Questions
                </h2>
            </button>
            <button type="button" onClick={navigatehome} className="tags">
                <h2>
                    Tags
                </h2>
            </button>
        </div>
    );
}

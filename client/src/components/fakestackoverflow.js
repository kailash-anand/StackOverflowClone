import React from 'react';
import axios from 'axios';
import '../stylesheets/fakestackoverflow.css';

export default function fakeStackOverflow(props) {

  const loginClick = () => {
    props.setPage(1); // Update page state to 1 (or any other value you want)
  }

  const registerClick = () => {
    props.setPage(2);
  }

  return (
    <div className='background'>
      <div className='container'> {/* New container div */}
        <h1 className='title'>Fake Stack Overflow</h1>
        <button className='login' onClick={loginClick} >Login</button>
        <button className='register' onClick={registerClick} >Register</button>
        <button className='guest'>Continue as Guest</button>
      </div>
    </div>
  );
}

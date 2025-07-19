// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import React, { useEffect } from 'react';
import './stylesheets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/Welcome.js'
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js'
import HomePage from './pages/HomePage.js';
import TagsPage from './pages/TagsPage.js'

import { Login } from './components/LoginForm.js'
import { Register } from './components/RegisterForm.js';
import { Questionsform } from './components/newQuestion.js';
import { DisplayQuestionDetails } from './components/answers.js';
import { Tagspage } from './components/tags.js';
import { User } from './components/user.js';
import { SearchQuery } from './components/search.js';
import { ToastContainer } from 'react-toastify';
import NewQuestionPage from './pages/NewQuestionPage.js';

let currentUser = null;
let sessionUser = null;
let tempUser = null;
let currentEditQuestion = null

// function App() {
//   const [page, setPage] = React.useState(0);
//   const [data, setData] = React.useState(null);

//   const fetchData = async () => {
//     try {
//       const questionsResponse = await axios.get('http://localhost:8000/api/questions');
//       const questions = questionsResponse.data;
  
//       const answersResponse = await axios.get('http://localhost:8000/api/answers');
//       const answers = answersResponse.data;
  
//       const tagsResponse = await axios.get('http://localhost:8000/api/tags');
//       const tags = tagsResponse.data;

//       const usersResponse = await axios.get('http://localhost:8000/api/users');
//       const users = usersResponse.data;

//       const commentsResponse = await axios.get('http://localhost:8000/api/comments');
//       const comments = commentsResponse.data;
  
//       const combinedData = {
//         questions,
//         answers,
//         tags,
//         users,
//         comments,
//         currentUser,
//         tempUser,
//         currentEditQuestion
//       };

//       if(sessionUser !== null)
//       {
//         combinedData.currentUser = sessionUser;
//       }

//       setData(combinedData);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   if(data === null)
//   {
//     fetchData();
//   }

//   if(data != null)
//   {
//     if(data.currentUser !== null)
//     {
//       sessionUser = data.currentUser;
//     } 

//     if (page === 0)
//     {
//       return (
//         <section className="fakeso">
//           <WelcomePage page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 1)
//     {
//       return (
//         <section >
//           <Login page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 2)
//     {
//       return (
//         <section >
//           <Register page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 3)
//     {
//       return (
//         <section >
//           <HomePage page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 4)
//     {
//       return (
//         <section >
//           <Questionsform page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 5)
//     {
//       return (
//         <section >
//           <DisplayQuestionDetails page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 6){
//       return (
//         <section>
//           <Tagspage page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       )
//     }
//     else if (page === 7) {
//       return (
//         <section >
//           <User page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//     else if (page === 8) {
//       return (
//         <section >
//           <SearchQuery page={page} setPage={setPage} data={data} setData={setData}/>
//         </section>
//       );
//     }
//   }
// }

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<WelcomePage/>}/>
				<Route path='/login' element={<LoginPage/>}/>
				<Route path='/register' element={<RegisterPage/>}/>
				<Route path='/home/:firstName' element={<HomePage/>}/>
				<Route path='/home/:firstName/new_question' element={<NewQuestionPage/>}/>
				<Route path='/tags/:firstName' element={<TagsPage/>}/>
			</Routes>
			<ToastContainer />
		</Router>
	);
}



export default App;

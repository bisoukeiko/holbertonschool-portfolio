import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './Components/UserContext';
import Home from './Components/Home';
import Header from './Components/Header';
// import Login from './Components/Login';
import User from './Components/User';
import Todo from './Components/Todo';


function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          {/* <Route path='/' element={<Login />} /> */}
          <Route path='/' element={<Home />} />
          <Route path='/user' element={<User />} />
          <Route path='/todo' element={<Todo />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

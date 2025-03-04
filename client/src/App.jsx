import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserProvider } from './Components/UserContext';
import Home from './Components/Home';
import Header from './Components/Header';
import Party from './Components/Party';
import Rsvp from './Components/Rsvp';
import CreateCard from './Components/CreateCard';


function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/party' element={<Party />} />
          <Route path='/createcard' element={<CreateCard />} />
          <Route path='/Rsvp/:partyId' element={<Rsvp />} />
        </Routes>

      </Router>

    </UserProvider>
  );
}

export default App;

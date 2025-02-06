import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Todo from './Todo';
import 'bootstrap/dist/css/bootstrap.min.css'
// import Edit from './Edit';


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Todo />} />
          {/* <Route path='/create' element={<Create />} /> */}
          {/* <Route path='/read/:id' element={<Read />} /> */}
          {/* <Route path='/edit/:id' element={<Edit />} /> */}
        </Routes>
      
      </BrowserRouter>
  )
}

export default App

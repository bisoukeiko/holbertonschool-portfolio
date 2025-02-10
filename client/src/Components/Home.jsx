import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'
import Login from "./Login";
import User from "./User";
import Todo from "./Todo";

function Home() {
  const location = useLocation();
  const idGoogle = location.state?.idGoogle || '';

  return (
    // <div className="grid gap-3">
    //   <div className="p-2">Home</div>
    //   <div className="p-2"><Link to={`/`} className='btn btn-sm btn-outline-dark'>Login</Link></div>
    //   <div className="p-2"><Link to={`/user/`} className='btn btn-sm btn-outline-dark'>User</Link></div>
    // </div>
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/user">User</Link> | <Link to="/todo">Todo</Link>
      </nav>
      <Login />
      <User idGoogle={idGoogle} />
      {/* <Todo /> */}
    </div>
  )
}

export default Home
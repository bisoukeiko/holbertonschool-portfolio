import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="grid gap-3">
      <div className="p-2">Home</div>
      <div className="p-2"><Link to={`/`} className='btn btn-sm btn-outline-dark'>Login</Link></div>
      <div className="p-2"><Link to={`/user/`} className='btn btn-sm btn-outline-dark'>User</Link></div>
    </div>
  )
}

export default Home
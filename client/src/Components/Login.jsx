import React from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';


function Login() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLoginSuccess(credentialResponse) {
    try {
      const googleInfo = jwtDecode(credentialResponse.credential);
      // console.log(googleInfo);

      setIsLoggedIn(true);

      // ユーザーがDBに存在するか確認
      // check User exist in detabase
      const userExist = await axios.get('http://localhost:5000/userSelect', {params: { sub: googleInfo.sub }});
      // console.log(userExist);
      if (userExist.data.length === 0) {
        await axios.post('http://localhost:5000/userInsert', {
          gSub: googleInfo.sub,
          gName: googleInfo.name,
          gEmail: googleInfo.email
        });
      }
      // } else {
      //   await axios.put(`http://localhost:5000/userUpdateLogin`, userExist.data[0]);
      // }

      navigate('/home', {state: {idGoogle: googleInfo.sub}});
    } catch (error) {
      console.error('Error login process:', error);
    }
  }

  function handleLogout() {
    googleLogout();
    setIsLoggedIn(false);
    console.log('logout');
    navigate('/home', {state: {idGoogle: ''}});
  }

  return (
    <div className="d-flex justify-content-center">
    {isLoggedIn ? (
        <button className='btn btn-danger' onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <div className="w-auto">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Login;

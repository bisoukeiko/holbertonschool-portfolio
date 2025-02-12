import React from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from 'axios';
import {useUser} from './UserContext'


function Header() {
  const { userId, login, logout } = useUser();

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLoginSuccess(credentialResponse) {
    try {
      const googleInfo = jwtDecode(credentialResponse.credential);
      // console.log(googleInfo);

      // ユーザーがDBに存在するか確認
      // check User exist in detabase
      let userExist = await axios.get('http://localhost:5000/user/select', {params: { sub: googleInfo.sub }});

      if (userExist.data.length === 0) {
        await axios.post('http://localhost:5000/user/insert', {
          gSub: googleInfo.sub,
          gName: googleInfo.name,
          gEmail: googleInfo.email
        });

        userExist = await axios.get('http://localhost:5000/user/select', {params: { sub: googleInfo.sub }});
      }

      login(userExist.data[0].id_user);  // コンテキストにユーザーIDを保存
      // console.log('User ID:', userExist.data[0].id_user); 

      navigate('/');

    } catch (error) {
      console.error('Error login process:', error);
    }
  }

  function handleLogout() {
    googleLogout();

    logout(); //UseContextからインポート 
    console.log('logout');
    navigate('/');
  }

  return (
    <header>
      <nav>
        <Link to="/user">User</Link> | <Link to="/todo">Todo</Link> |
        <div className="d-flex justify-content-end">
        {userId ? (
            <button className='btn btn-primary' onClick={handleLogout}>
              Logout
            </button>
        ) : (

            <div style={{ width: "250px" }}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>

        )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

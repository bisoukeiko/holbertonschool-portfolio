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
    <header className="bg-white shadow-sm">
      <h1 className='fw-semibold text-center mt-5'>HAPPY CANDLES</h1>
      <nav className="container d-flex justify-content-between align-items-center py-3">
        {/* ナビゲーションメニュー */}
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" className="nav-link text-dark fw-semibold">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/party" className="nav-link text-dark fw-semibold">
              Party
            </Link>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link text-dark fw-semibold" href="#">
              Link
            </a>
          </li> */}
        </ul>

        {/* Googleログイン or ログアウト */}
        <div>
          {userId ? (
            <span
              className="text-danger fw-bold cursor-pointer border rounded p-2 ps-4 pe-4"
              style={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </span>
          ) : (
            <div style={{ width: "200px" }}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
              />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;

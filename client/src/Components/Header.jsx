import React, { useState } from 'react';
import { googleLogout, GoogleOAuthProvider, useGoogleLogin  } from '@react-oauth/google';
// import { GoogleLogin, googleLogout, GoogleOAuthProvider, useGoogleLogin  } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {useUser} from '../Contexts/UserContext'


function Header() {

  const { userId, login, logout, accessToken } = useUser();

  const navigate = useNavigate();

  function handleLogout() {
    googleLogout();

    logout(); //UseContextからインポート 
    console.log('logout');
    localStorage.clear();
    navigate('/');
  }

  const googlelogin = useGoogleLogin({
    onSuccess: (codeResponse) => responseGoogle(codeResponse),
    flow: "auth-code",
    scope: "email profile openid https://www.googleapis.com/auth/drive.file",
  });

  const responseGoogle = async (codeResponse) => {
    try {
      console.log("Google codeResponse:", JSON.stringify(codeResponse));
  
      const response = await axios.post(`http://localhost:5000/auth/google`, { code: codeResponse.code });
  
      const googleInfo = response.data.user;
      const accessToken = response.data.access_token;
      // const refreshToken = response.data.refresh_token;

      let userExist = await axios.get('http://localhost:5000/user/select', {
        params: { sub: googleInfo.id }
      });
  
      if (userExist.data.length === 0) {
        await axios.post('http://localhost:5000/user/insert', {
          gSub: googleInfo.id,
          gName: googleInfo.given_name,
          gEmail: googleInfo.email
        });
  
        userExist = await axios.get('http://localhost:5000/user/select', {
          params: { sub: googleInfo.id }
        });
      }
  
      login(userExist.data[0].id_user, accessToken);
  
    } catch (error) {
      console.error('Error login:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <h1 className='fw-semibold text-center mt-4 display-2' style={{ fontFamily: 'cursive' }}>
        <span style={{ color: 'red' }}>H</span>
        <span style={{ color: 'orange' }}>a</span>
        <span style={{ color: 'yellow' }}>p</span>
        <span style={{ color: 'green' }}>p</span>
        <span style={{ color: 'blue' }}>y</span>
        &nbsp;
        <span style={{ color: 'purple' }}>C</span>
        <span style={{ color: 'pink' }}>a</span>
        <span style={{ color: 'cyan' }}>n</span>
        <span style={{ color: 'lime' }}>d</span>
        <span style={{ color: 'magenta' }}>l</span>
        <span style={{ color: 'gold' }}>e</span>
        <span style={{ color: 'deepskyblue' }}>s</span>
      </h1>
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
          <li className="nav-item">
            <Link to="/createcard" className="nav-link text-dark fw-semibold">
              Create Invitations
            </Link>
          </li>
        </ul>

        {/* Google login logout */}
        <div>
            <GoogleOAuthProvider clientId={''}>
                {!userId ? (
                  <button className='btn btn-light d-flex align-items-center shadow-sm border rounded' onClick={() => googlelogin()}>
                      <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="me-2" width="20" height="20"/>
                      <span className="">Sign in with Google</span>
                  </button>
                ) : (
                  <button className='btn btn-light d-flex align-items-center shadow-sm border rounded' onClick={handleLogout}>
                      <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google Logo" className="me-2" width="20" height="20"/>
                      <span className=''>Logout</span>
                  </button>
                )}
            </GoogleOAuthProvider>
        </div>
      </nav>
    </header>
  );
}


// return (
  // <GoogleOAuthProvider clientId={''}>
  //   {!isLoggedIn ? (
  //     <button onClick={() => googlelogin()}>Login</button>
  //   ) : (
  //     <div>
  //       <p>Id: {id}</p>
  //       <p>Email: {email}</p>
  //       <p>GivenName: {givenName}</p>
  //       <p>AccessToken2: {accessToken}</p>
  //       <p>RefreshToken: {refreshToken}</p>
  //       <button onClick={() => setIsLoggedIn(false)}>Logout</button>
  //     </div>
  //   )}
  // </GoogleOAuthProvider>
// );
// }


export default Header;
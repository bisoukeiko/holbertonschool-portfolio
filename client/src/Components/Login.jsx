import React from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();

  function handleLogout () {
    googleLogout();
  }

  return (
    <div>
      <h2>Google ログイン</h2>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log('Login Success:', credentialResponse);
          console.log(jwtDecode(credentialResponse.credential));
          navigate('/home');
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />

    </div>
  );
}

export default Login;

import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '';
// const CLIENT_ID = 'xxxxxxxxxxxxxxxxx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
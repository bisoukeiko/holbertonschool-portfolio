import axios from 'axios';
import qs from 'qs';



export const getGoogleToken = async(req, res) => {
    const { code } = req.body;

    if (code === undefined) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  
    let accessToken = '';
    let refreshToken = '';
  
    // Google OAuthの認証情報を設定
    const params = {
      code: code,
      client_id: '',
      client_secret: '',
      redirect_uri: 'http://127.0.0.1:3000',
      grant_type: 'authorization_code'
    }
  
    // Googleにアクセストークンをリクエスト
    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.google.com/o/oauth2/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(params)
      });
      // console.log(response.data);
      accessToken = response.data.access_token;
      refreshToken = response.data.refresh_token;
    } catch (error) {
      console.error('Error: ', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    let user = {};
  
    // 取得したアクセストークンを利用してユーザー情報を取得
    try {
      const response = await axios({
        method: 'get',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      // console.log(response.data);
      user = response.data;
    } catch (error) {
      console.error('Error: ', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
    return res.status(200).json({
      user: user, // user info
      access_token: accessToken,
      refresh_token: refreshToken,
      status: 200
    });
  }

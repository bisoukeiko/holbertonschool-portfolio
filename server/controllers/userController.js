import db from '../db.js';
import { v4 as uuid4 } from 'uuid';


// select user with id_google
export const getUserByGoogleId = (req, res) => {
    const { sub }  = req.query;
    const sql = `SELECT id_user
                   FROM TB_USER
                  WHERE id_google = ?;`
  
    db.query(sql, [sub], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error selecting user', Error: err});
      }
      return res.status(200).json(result);
    })
};


// select user with user ID
export const getUserById = (req, res) => {
    const { userId }  = req.query;
    const sql = `SELECT id_user,
                        user_name,
                        user_email,
                        user_phone
                   FROM TB_USER
                  WHERE id_user = ?;`
  
    db.query(sql, [userId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error selecting user', Error: err});
      }
      return res.status(200).json(result);
    })
};


export const insertUser = (req, res) => {
  const sql = `INSERT INTO TB_USER
                     (id_user,
                      id_google,
                      user_name,
                      user_email)
              VALUES (?, ?, ?, ?);`;

  const values = [uuid4(),
                  req.body.gSub,
                  req.body.gName,
                  req.body.gEmail
                 ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion user:', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      return res.status(201).json({ message: 'User inserted successfully' });
    }
  });
};


export const updateUser = (req, res) => {
    const sql = `UPDATE TB_USER SET
                        user_name = ?,
                        user_email = ?,
                        user_phone = ?
                  WHERE id_user = ?;`;
  
    const values = [req.body.userName,
                    req.body.userEmail,
                    req.body.userPhone,
                    req.body.userId
                   ];
  
    db.query(sql, values, (err, result) => {
      if(err) {
        console.error('Error update user:', err);
        return res.status(500).json({ error: 'Database error' });
      } else {
        return res.status(201).json({ message: 'User updated successfully' });
      }
    });
};

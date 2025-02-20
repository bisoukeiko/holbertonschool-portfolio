import db from '../db.js';
import { v4 as uuid4 } from 'uuid';
import UserValidator from '../validators/UserValidator.js';


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
  const { gSub, gName, gEmail } = req.body;
  const validator = new UserValidator(gName, gEmail, null);
  if (!validator.validate()) {
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `INSERT INTO TB_USER
                     (id_user,
                      id_google,
                      user_name,
                      user_email)
              VALUES (?, ?, ?, ?);`;

  const values = [uuid4(), gSub, gName, gEmail];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion user:', err);
      return res.status(500).json({ error: 'error: insert user' });
    } else {
      return res.status(201).json({ message: 'User inserted successfully' });
    }
  });
};


export const updateUser = (req, res) => {
    const { idUser, userName, userEmail, userPhone } = req.body;

    const validator = new UserValidator(userName, userEmail, userPhone);
    if (!validator.validate()) {
      console.log(validator.getErrors());
      return res.status(400).json({errors: validator.getErrors()});
    }

    const sql = `UPDATE TB_USER SET
                        user_name = ?,
                        user_email = ?,
                        user_phone = ?
                  WHERE id_user = ?;`;
  
    const values = [userName, userEmail, userPhone, idUser];
  
    db.query(sql, values, (err, result) => {
      if(err) {
        return res.status(500).json({ error: 'error: update user' });
      } else {
        return res.status(201).json({ message: 'User updated successfully' });
      }
    });
};

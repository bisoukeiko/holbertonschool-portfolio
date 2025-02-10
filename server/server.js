import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import {v4 as uuidv4} from 'uuid';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'node',
  password: 'Node@2025',
  database: 'birthday_party'
})

db.connect((err) => {
  if(!err) {
    console.log("Connected to database successfully");
  } else {
    console.log("Failed to connect database");
  }
})

app.get('/todoSelect', (req, res) => {
  const sql = `SELECT id_task,
                      id_party,
                      task,
                      fg_done
                 FROM TB_TODO
             ORDER BY update_at desc;`
db.query(sql, (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    }
    return res.json(result);
  })
});

// Todo Add 
app.post('/todoAdd', (req, res) => {
  const sql = 'INSERT INTO TB_TODO (id_task, id_party, task, fg_done) VALUES (?, ?, ?, ?);';
  // console.log(res.body);
  const values = [
    uuidv4(),
    'cda12573-e278-11ef-a2df-00155deb4d19',
    req.body.task,
    false
  ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion todo:', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      const sql = `SELECT id_task,
                          id_party,
                          task,
                          fg_done
                     FROM TB_TODO
                 ORDER BY update_at desc;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      })
    }
  });
});


// app.get('/read/:id', (req, res) => {
//   const sql = 'SELECT * FROM TB_TODO WHERE id_task = ?';
//   const id = req.params.id;

//   db.query(sql,[id], (err, result)=> {
//     if(err) {
//       console.error("Database Error:", err);
//       return res.json({Message: 'Error inside server', Error: err});
//     }
//     return res.json(result);
//   });
// });

// Todo Update the task
app.put('/todoUpdate/:id', (req, res) => {
  const sql = 'UPDATE TB_TODO SET task=? WHERE id_task=?';
  const id = req.params.id;
  db.query(sql, [req.body.task, id], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    } else {
      const sql = `SELECT id_task,
                          id_party,
                          task,
                          fg_done
                     FROM TB_TODO
             ORDER BY update_at desc;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  });
});

// Todo Update the flag done
app.put('/todoUpdatefg/:id', (req, res) => {
  const sql = 'UPDATE TB_TODO SET fg_done=? WHERE id_task=?';
  const id = req.params.id;

  // fg_done を数値で扱うため、0/1 に変換
  const updatedFlag = req.body.fg_done ? 1 : 0; 

  db.query(sql, [updatedFlag, id], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    } else {
      const sql = `SELECT id_task,
                          id_party,
                          task,
                          fg_done
                     FROM TB_TODO
             ORDER BY update_at desc;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  });
});

// Todo delete
app.delete('/todoDelete/:id', (req, res) => {
  const sql = 'DELETE FROM TB_TODO WHERE id_task = ?';
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    } else {
      const sql = `SELECT id_task,
                          id_party,
                          task,
                          fg_done
                     FROM TB_TODO
                 ORDER BY update_at desc;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  }); 
});


// user select with id_google
app.get('/userSelect/', (req, res) => {
  const { sub }  = req.query;
  const sql = `SELECT id_user
                 FROM TB_USER
                WHERE id_google = ?;`

  db.query(sql, [sub], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error select user', Error: err});
    }
    return res.status(200).json(result);
  })
});

// user select with id_user
app.get('/userSelectIdUser/', (req, res) => {
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
      return res.status(500).json({Message: 'Error select user', Error: err});
    }
    return res.status(200).json(result);
  })
});

// user Add
app.post('/userInsert', (req, res) => {
  const sql = `INSERT INTO TB_USER
                     (id_user,
                      id_google,
                      user_name,
                      user_email)
              VALUES (?, ?, ?, ?);`;

  const values = [uuidv4(),
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
});

// user Update
app.put('/userUpdate', (req, res) => {
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
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

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
app.get('/', (req, res) => {
  const sql = `SELECT id_task,
                      id_party,
                      task,
                      fg_done,
                      created_at,
                      updated_at
                 FROM TB_TODO;`
db.query(sql, (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    }
    return res.json(result);
  })
});

// Todo Add 
app.post('/todoadd', (req, res) => {
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
                          fg_done,
                          created_at,
                          updated_at
                     FROM TB_TODO;`
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
app.put('/todoupdate/:id', (req, res) => {
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
                          fg_done,
                          created_at,
                          updated_at
                     FROM TB_TODO;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  });
});

// Todo Update the flag done
app.put('/todoupdatefg/:id', (req, res) => {
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
                          fg_done,
                          created_at,
                          updated_at
                     FROM TB_TODO;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  });
});

// Todo delete
app.delete('/tododelete/:id', (req, res) => {
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
                          fg_done,
                          created_at,
                          updated_at
                     FROM TB_TODO;`
      db.query(sql, (err, result) => {
        return res.status(201).json(result);
      });
    }
  }); 
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

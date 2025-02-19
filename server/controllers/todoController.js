import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';


export const getTodos = (req, res) => {
  const { partyId }  = req.query;
    const sql = `SELECT id_task,
                        id_party,
                        task,
                        fg_done
                   FROM TB_TODO
                  WHERE id_party = ?
               ORDER BY created_at desc;`
  db.query(sql, [partyId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error select todo', Error: err});
      }
      return res.status(201).json(result);
    });
};


export const addTodo = (req, res) => {
  const sql = `INSERT INTO TB_TODO 
                       (id_task,
                        id_party,
                        task,
                        fg_done)
                VALUES (?, ?, ?, ?);`;
  // console.log('insert', req.body);
  const values = [
        uuidv4(),
        req.body.id_party,
        req.body.task,
        false
  ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion todo:', err);
      return res.status(500).json({ error: 'Error insert todo' });
    } else {
      req.query.partyId = req.body.id_party;
      getTodos(req, res);
    }
  });
};


export const updateTodo = (req, res) => {
    const sql = 'UPDATE TB_TODO SET task = ? WHERE id_task=?;';
    const id = req.params.id;
    db.query(sql, [req.body.task, id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error update todo', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getTodos(req, res);
      }
    });
};


export const updateTodoFlag = (req, res) => {
    const sql = 'UPDATE TB_TODO SET fg_done=? WHERE id_task=?;';
    const id = req.params.id;
  
    // fg_done を数値で扱うため、0/1 に変換
    const updatedFlag = req.body.fg_done ? 1 : 0; 
  
    db.query(sql, [updatedFlag, id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error update todo flag', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getTodos(req, res);
      }
    });
};


export const deleteTodo = (req, res) => {
    const sql = 'DELETE FROM TB_TODO WHERE id_task = ?;';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.json({Message: 'Error delete todo', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getTodos(req, res);
      }
    }); 
};


export const deleteTodoByParty = (partyId) => {
  return new Promise((resolve, reject) => {

    const sql = 'DELETE FROM TB_TODO WHERE id_party = ?;';

    db.query(sql, [partyId], (err, result) => {
      if(err) {
        console.error("Error delete todos", err);
        return reject(err);
      } else {
        resolve(result);
      }
    });
  }); 
};

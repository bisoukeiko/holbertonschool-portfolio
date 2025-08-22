import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import TodoValidator from '../validators/TodoValidator.js';


export const getTodos = (req, res) => {
  const { partyId }  = req.query;
    const sql = `SELECT TBT.id_task,
                        TBT.id_party,
                        TBT.task,
                        TBT.fg_done
                   FROM TB_TODO AS TBT,
                        TB_PARTY AS TBP
                  WHERE TBT.id_party = ?
                    AND TBT.id_party = TBP.id_party
                    AND TBP.delete_at IS NULL
               ORDER BY TBT.created_at ASC;`
  db.query(sql, [partyId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error select todo', Error: err});
      }
      return res.status(201).json(result);
    });
};


export const addTodo = (req, res) => {

  const { id_party, task } = req.body;
  const validator = new TodoValidator(task);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `INSERT INTO TB_TODO 
                       (id_task,
                        id_party,
                        task,
                        fg_done)
                VALUES (?, ?, ?, ?);`;

  // console.log('insert', req.body);
  const values = [
        uuidv4(),
        id_party,
        task,
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

    const { task } = req.body;
    const validator = new TodoValidator(task);
    if (!validator.validate()) {
      // console.log(validator.getErrors());
      return res.status(400).json({errors: validator.getErrors()});
    }

    const sql = 'UPDATE TB_TODO SET task = ? WHERE id_task=?;';
    const id = req.params.id;
    db.query(sql, [task, id], (err, result) => {
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
        return res.status(500).json({Message: 'Error delete todo', Error: err});
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


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const addInitialTodos = async (partyId) => {
  const initialTodos = [
    'Create invitation card',
    'Book the venue',
    'Order or bake a birthday cake',
    'Prepare decorations',
    'Organize games',
    'Prepare small gifts for guests',
    'Confirm RSVPs'    
  ];

  const sql = `INSERT INTO TB_TODO 
                  (id_task, id_party, task, fg_done) 
               VALUES (?, ?, ?, ?);`;

  try {
    for (const task of initialTodos) {
      const values = [uuidv4(), partyId, task, false];

      // 各タスクに対して遅延を加える（例: 200msの遅延）
      await delay(200); 

      await new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Error inserting todo:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    return { message: "All tasks inserted in order" };
  } catch (err) {
    throw new Error("Error inserting tasks: " + err);
  }
};
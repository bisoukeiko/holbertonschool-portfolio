import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';


// select child with user ID
export const getChildByIdUser = (req, res) => {
    const { userId }  = req.query;
    const sql = `SELECT id_child,
                        id_parent,
                        child_name,
                        DATE_FORMAT(child_birthday, '%Y-%m-%d') AS child_birthday
                   FROM TB_CHILD
                  WHERE id_parent = ?
               ORDER BY child_birthday desc;`
  
    db.query(sql, [userId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error selecting user', Error: err});
      }
      return res.status(200).json(result);
    })
};


// insert child
export const insertChild = (req, res) => {
  const sql = `INSERT INTO TB_CHILD 
                       (id_child,
                        id_parent,
                        child_name,
                        child_birthday)
                VALUES (?, ?, ?, ?);`;

        const values = [
          uuidv4(),
          req.body.id_parent,
          req.body.child_name,
          req.body.child_birthday
        ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion child:', err);
      return res.status(500).json({ error: 'Database error' });
    } else {
      req.query.userId = req.body.id_parent;
      getChildByIdUser(req, res);
    }
  });
};


// update child by child ID
export const updateChild = (req, res) => {
  const sql = `UPDATE TB_CHILD 
                  SET child_name = ?,
                      child_birthday = ?
                WHERE id_child = ?;`;
  const childId = req.params.childId;

  db.query(sql, [req.body.child_name, req.body.child_birthday, childId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error inside server', Error: err});
    } else {
      req.query.userId = req.body.id_parent;
      getChildByIdUser(req, res);
    }
  });
}


// delete child by child ID
export const deleteChild = (req, res) => {
  const sql = 'DELETE FROM TB_CHILD WHERE id_child = ?;';
  const childId = req.params.childId;
  db.query(sql, [childId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error inside server', Error: err});
    } else {
      getChildByIdUser(req, res);
    }
  }); 
};

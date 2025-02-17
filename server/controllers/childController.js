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


// select child & party with user ID
export const getChildParty = (req, res) => {
  const { userId }  = req.query;
  const sql = `SELECT TBC.id_child,
                      TBC.child_name,
                      DATE_FORMAT(TBC.child_birthday, '%Y %M %d') AS child_birthday,
                      TBP.id_party,
                      DATE_FORMAT(TBP.party_date, '%Y %M %d') AS party_date,
                      TIME_FORMAT(TBP.party_time_from, '%H:%i') AS party_time_from,
                      TIME_FORMAT(TBP.party_time_to, '%H:%i') AS party_time_to,
                      TBP.party_place,
                      TIMESTAMPDIFF(YEAR, TBC.child_birthday, TBP.party_date) AS child_years
                 FROM TB_CHILD AS TBC
            LEFT JOIN TB_PARTY AS TBP 
                   ON TBC.id_child = TBP.id_child
                WHERE TBC.id_parent = ?
             ORDER BY child_birthday, TBP.party_date DESC;`

  db.query(sql, [userId], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error selecting user', Error: err});
    }

    const childData = {};

    result.forEach(row => {
        if (!childData[row.id_child]) {
            childData[row.id_child] = {
                id_child: row.id_child,
                child_name: row.child_name,
                child_birthday: row.child_birthday,
                child_parties: []
            };
        }

        if (row.id_party) {
            childData[row.id_child].child_parties.push({
                id_party: row.id_party,
                id_child: row.id_child,
                child_name: row.child_name,
                party_date: row.party_date,
                party_time_from: row.party_time_from,
                party_time_to: row.party_time_to,
                party_place: row.party_place,
                child_years: row.child_years
            })
        }
    });

    return res.status(200).json(Object.values(childData));
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
      getChildParty(req, res);
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
      getChildParty(req, res);
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
      getChildParty(req, res);
    }
  }); 
};

import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import ChildValidator from '../validators/ChildValidator.js';


// select child with user ID
export const getChildByIdUser = (req, res) => {
    const { userId }  = req.query;
    const sql = `SELECT id_child AS idChild,
                        id_parent AS idParent,
                        child_name AS childName,
                        DATE_FORMAT(child_birthday, '%Y-%m-%d') AS childBirthday
                   FROM TB_CHILD
                  WHERE id_parent = ?
               ORDER BY child_birthday desc;`
  
    db.query(sql, [userId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error selecting child', Error: err});
      }
      return res.status(200).json(result);
    })
};


// select child & party with user ID
export const getChildParty = (req, res) => {
  const { userId, insertedUuid } = req.query;
  const sql = `SELECT TBC.id_child,
                      TBC.child_name,
                      DATE_FORMAT(TBC.child_birthday, '%Y-%m-%d') AS child_birthday,
                      TBP.id_party,
                      DATE_FORMAT(TBP.party_date, '%Y-%m-%d') AS party_date,
                      TIME_FORMAT(TBP.party_time_from, '%H:%i') AS party_time_from,
                      TIME_FORMAT(TBP.party_time_to, '%H:%i') AS party_time_to,
                      TBP.party_place,
                      TBP.party_place2,
                      TBP.party_place3,
                      TIMESTAMPDIFF(YEAR, TBC.child_birthday, TBP.party_date) AS child_years,
                      TBP.party_contact1,
                      TBP.party_contact2
                 FROM TB_CHILD AS TBC
            LEFT JOIN TB_PARTY AS TBP 
                   ON TBC.id_child = TBP.id_child
            LEFT JOIN TB_USER AS TBU
                   ON TBC.id_parent = TBU.id_user
                WHERE TBU.id_user = ?
                  AND TBC.id_parent = ?
             ORDER BY TBC.child_birthday, TBP.party_date DESC;`

  db.query(sql, [userId, userId], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error selecting child et party', Error: err});
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
                idParty: row.id_party,
                idChild: row.id_child,
                childName: row.child_name,
                partyDate: row.party_date,
                partyTimeFrom: row.party_time_from,
                partyTimeTo: row.party_time_to,
                partyPlace: row.party_place,
                partyPlace2: row.party_place2,
                partyPlace3: row.party_place3,
                childYears: row.child_years,
                partyContact1 : row.party_contact1,
                partyContact2 : row.party_contact2
            })
        }
    });

    return res.status(200).json({
      insertedUuid: insertedUuid, // 挿入したUUIDを含める
      parties: Object.values(childData)
    });
  })
};


// insert child
export const insertChild = (req, res) => {

  const { id_parent, child_name, child_birthday } = req.body;
  const validator = new ChildValidator(child_name, child_birthday);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }


  const sql = `INSERT INTO TB_CHILD 
                       (id_child,
                        id_parent,
                        child_name,
                        child_birthday)
                VALUES (?, ?, ?, ?);`;

        const values = [uuidv4(), id_parent, child_name, child_birthday];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion child:', err);
      return res.status(500).json({ error: 'Error insert child' });
    } else {
      req.query.userId = req.body.id_parent;
      getChildParty(req, res);
    }
  });
};


// update child by child ID
export const updateChild = (req, res) => {

  const { child_name, child_birthday } = req.body;
  const validator = new ChildValidator(child_name, child_birthday);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `UPDATE TB_CHILD 
                  SET child_name = ?,
                      child_birthday = ?
                WHERE id_child = ?;`;
  const childId = req.params.childId;

  db.query(sql, [req.body.child_name, req.body.child_birthday, childId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error update child', Error: err});
    } else {
      req.query.userId = req.body.id_parent;
      getChildParty(req, res);
    }
  });
}


// delete child by child ID
export const deleteChild = (req, res) => {
  const { userId }  = req.query;
  const sql = 'DELETE FROM TB_CHILD WHERE id_child = ?;';
  const childId = req.params.childId;
  db.query(sql, [childId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.json({Message: 'Error delete child', Error: err});
    } else {
      req.query.userId = userId;
      getChildParty(req, res);
    }
  }); 
};

import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { getChildParty } from './childController.js';
import { deleteTodoByParty } from './todoController.js';


// insert party
export const insertParty = (req, res) => {
  const sql = `INSERT INTO TB_PARTY
                       (id_party,
                        id_child,
                        party_date,
                        party_time_from,
                        party_time_to,
                        party_place,
                        party_contact1,
                        party_contact2)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
          uuidv4(),
          req.body.idChild,
          req.body.partyDate,
          req.body.partyTimeFrom,
          req.body.partyTimeTo,
          req.body.partyPlace,
          req.body.partyContact1,
          req.body.partyContact2
  ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion child:', err);
      return res.status(500).json({ error: 'Error insert party' });
    } else {
      const insertedUuid = values[0]; 

      req.query.userId = req.body.userId;
      req.query.insertedUuid = insertedUuid;
      getChildParty(req, res);
    }
  });
};


// update party by party ID
export const updateParty = (req, res) => {
  const userId  = req.body.userId;
  const sql = `UPDATE TB_PARTY 
                  SET party_date = ?,
                      party_time_from = ?,
                      party_time_to = ?,
                      party_place = ?,
                      party_contact1 = ?,
                      party_contact2 = ?
                WHERE id_party = ?;`;

  const partyId = req.params.partyId;
  db.query(sql, [ req.body.partyDate,
                  req.body.partyTimeFrom,
                  req.body.partyTimeTo,
                  req.body.partyPlace,
                  req.body.partyContact1,
                  req.body.partyContact2,
                  partyId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error update party', Error: err});
    } else {
      return res.status(201).json({ message: 'User updated successfully' });
    }
  });
}


// delete party by partyID
export const deleteParty =async  (req, res) => {
  const { userId }  = req.body;
  const partyId = req.params.partyId;

  try {
    // delete todos by partyID
    await deleteTodoByParty(partyId);

    const sql = 'DELETE FROM TB_PARTY WHERE id_party = ?;';

    db.query(sql, [partyId], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.json({Message: 'Error delete party', Error: err});
      } else {
        req.query.userId = userId;
        getChildParty(req, res);
      }
    }); 
  } catch (err) {
    return res.status(500).json({ Message: 'Error deleting todos', Error: err });
  }
};

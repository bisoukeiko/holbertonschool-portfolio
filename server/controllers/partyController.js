import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { getChildParty } from './childController.js';
import { deleteTodoByParty } from './todoController.js';
import { deleteShoppingByParty } from './shoppingController.js';
import { deleteGuestByParty } from './guestController.js';
import PartyValidator from '../validators/PartyValidator.js';


// select party by child id
export const selectPartyByChild = (req, res) => {

  const { childId }  = req.query;
  const sql = `SELECT TBP.id_party AS idParty,
                      TIMESTAMPDIFF(YEAR, TBC.child_birthday, TBP.party_date) AS childYears
                 FROM TB_PARTY AS TBP,
                      TB_CHILD AS TBC
                WHERE TBC.id_child = ?
                  AND TBC.id_child = TBP.id_child;`

  db.query(sql, [childId], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error selecting party', Error: err});
    }
    return res.status(200).json(result);
  })
};


// select party by party id
export const selectParty = (req, res) => {

  const { partyId }  = req.query;
  const sql = `SELECT TBC.id_child AS idChild,
                      TBC.child_name AS childName,
                      TIMESTAMPDIFF(YEAR, TBC.child_birthday, TBP.party_date) AS childYears,
                      TBP.id_party AS idParty,
                      DATE_FORMAT(TBP.party_date, '%Y-%m-%d') AS partyDate,
                      DATE_FORMAT(TBP.party_date, '%W, %d %M %Y ') AS partyDate2,                      
                      TIME_FORMAT(TBP.party_time_from, '%H:%i') AS partyTimeFrom,
                      TIME_FORMAT(TBP.party_time_to, '%H:%i') AS partyTimeTo,
                      TBP.party_place AS partyPlace,
                      TBP.party_place2 AS partyPlace2,
                      TBP.party_place3 AS partyPlace3,
                      TBP.party_contact1 AS partyContact1,
                      TBP.party_contact2 AS partyContact2
                 FROM TB_PARTY AS TBP,
                      TB_CHILD AS TBC
                WHERE TBP.id_party = ?
                  AND TBP.id_child = TBC.id_child;`

  db.query(sql, [partyId], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error selecting party', Error: err});
    }
    return res.status(200).json(result);
  })
};


// insert party
export const insertParty = (req, res) => {
  const { idChild, partyDate, partyTimeFrom, partyTimeTo, partyPlace, partyPlace2, partyPlace3, partyContact1, partyContact2 } = req.body;
  const validator = new PartyValidator(partyDate, partyTimeFrom, partyTimeTo, partyPlace, partyPlace2, partyPlace3, partyContact1, partyContact2);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `INSERT INTO TB_PARTY
                       (id_party,
                        id_child,
                        party_date,
                        party_time_from,
                        party_time_to,
                        party_place,
                        party_place2,
                        party_place3,
                        party_contact1,
                        party_contact2)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  const values = [
          uuidv4(),
          idChild,
          partyDate,
          partyTimeFrom,
          partyTimeTo,
          partyPlace,
          partyPlace2,
          partyPlace3,
          partyContact1,
          partyContact2
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
  const { partyDate, partyTimeFrom, partyTimeTo, partyPlace, partyPlace2, partyPlace3, partyContact1, partyContact2 } = req.body;

  const validator = new PartyValidator(partyDate, partyTimeFrom, partyTimeTo, partyPlace, partyPlace2, partyPlace3, partyContact1, partyContact2);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `UPDATE TB_PARTY 
                  SET party_date = ?,
                      party_time_from = ?,
                      party_time_to = ?,
                      party_place = ?,
                      party_place2 = ?,
                      party_place3 = ?,
                      party_contact1 = ?,
                      party_contact2 = ?
                WHERE id_party = ?;`;

  const partyId = req.params.partyId;
  db.query(sql, [ partyDate,
                  partyTimeFrom,
                  partyTimeTo,
                  partyPlace,
                  partyPlace2,
                  partyPlace3,
                  partyContact1,
                  partyContact2,
                  partyId], (err, result) => {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error update party', Error: err});
    } else {
      req.query.userId = req.body.userId;
      req.query.insertedUuid = partyId;
      getChildParty(req, res);
      // req.query.partyId = partyId;
      // selectParty(req, res);
      // return res.status(201).json({ message: 'User updated successfully' });
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
    await deleteShoppingByParty(partyId);
    await deleteGuestByParty(partyId);

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

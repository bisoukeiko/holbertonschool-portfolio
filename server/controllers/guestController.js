import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import GuestValidator from '../validators/GuestValidator.js';


export const getGuestList = (req, res) => {
    const { partyId }  = req.query;
    const sql = `SELECT TBG.id_guest AS idGuest,
                        TBG.guest_name AS guestName,
                        TBG.guest_relation AS guestRelation,
                        TBG.guest_allergy AS guestAllergy,
                        TBG.other_info AS otherInfo,
                        TBG.parent_phone As parentPhone,
                        TBG.parent_email AS parentEmail,
                        TBGP.fg_attend AS fgAttend
                   FROM TB_GUEST AS TBG,
                        TB_PARTY_GUEST AS TBGP
                  WHERE TBGP.id_party = ?
                    AND TBGP.id_guest = TBG.id_guest
               ORDER BY guestName;`
  db.query(sql, [partyId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error select guest list', Error: err});
      }
      return res.status(201).json(result);
    });
};


export const getAllGuestList = (req, res) => {
  const { childId }  = req.query;
  const sql = `SELECT TBG.id_guest AS idGuest,
                      TBG.guest_name AS guestName,
                      TBG.guest_relation AS guestRelation,
                      TBG.guest_allergy AS guestAllergy,
                      TBG.other_info AS otherInfo,
                      TBG.parent_phone As parentPhone,
                      TBG.parent_email AS parentEmail                    
                 FROM TB_GUEST AS TBG,
                      (SELECT id_party
                         FROM TB_CHILD AS TBC,
                              TB_PARTY AS TBP
                        WHERE TBC.id_child = TBP.id_child
                          AND TBC.id_child = ?) AS TBP,
                      TB_PARTY_GUEST AS TBGP
                WHERE TBGP.id_party = TBP.id_party
                  AND TBGP.id_guest = TBG.id_guest
             GROUP BY idGuest
             ORDER BY guestName;`
db.query(sql, [childId], (err, result)=> {
    if(err) {
      console.error("Database Error:", err);
      return res.status(500).json({Message: 'Error select all guest list', Error: err});
    }
    return res.status(201).json(result);
  });
};


export const addGuest = async (req, res) => {

  let { partyId, idGuest, guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail} = req.body;

  const validator = new GuestValidator(guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `INSERT INTO TB_GUEST
                       (id_guest,
                        guest_name,
                        guest_relation,
                        guest_allergy,
                        other_info,
                        parent_phone,
                        parent_email)
                VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const insertedUuid = uuidv4();
  const values = [insertedUuid, guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail];

  try {
          if (!idGuest) {
              await new Promise((resolve, reject) => {
                  db.query(sql, values, (err, result) => {
                    if(err) {
                      console.error('Error insertion guest:', err);
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  });
              });

              idGuest = insertedUuid;
          }

          await insertPartyGuest(partyId, idGuest);

          req.query.partyId = partyId;
          getGuestList(req, res);

  } catch (err) {
      return res.status(500).json({ error: 'Failed to add guest', details: err });
  }
};


// insert TB_PARTY_GUEST
export const insertPartyGuest = (partyId, guestId) => {
    const sql = `INSERT INTO TB_PARTY_GUEST
                        (id_party,
                         id_guest,
                         fg_attend)
                    VALUES (?, ?, ?);`;

    const values = [partyId, guestId, 0];

    return new Promise((resolve, reject)=> {
        db.query(sql, values, (err, result) => {
            if(err) {
              console.error('Error insertion party_guest:', err);
              reject(err);
            } else {
              resolve(result);
            }
        });
    });
}


// update guest
export const updateGuest = (req, res) => {

    const { guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail} = req.body;

    const validator = new GuestValidator(guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail);
    if (!validator.validate()) {
      // console.log(validator.getErrors());
      return res.status(400).json({errors: validator.getErrors()});
    }

    const sql = `UPDATE TB_GUEST SET  guest_name = ?,
                                      guest_relation = ?,
                                      guest_allergy = ?,
                                      other_info = ?,
                                      parent_phone = ?,
                                      parent_email= ? 
                                WHERE id_guest=?;`;
    const id = req.params.id;
    const values = [guestName, guestRelation, guestAllergy, otherInfo, parentPhone, parentEmail, id];

    db.query(sql, values, (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error update todo', Error: err});
      } else {
        // req.query.partyId = req.body.id_party;
        // getGuestList(req, res);
        return res.status(201).json(result);
      }
    });
};


// export const updateGuestFlag = (req, res) => {
//     const sql = 'UPDATE TB_TODO SET fg_done=? WHERE id_task=?;';
//     const id = req.params.id;
  
//     // fg_done を数値で扱うため、0/1 に変換
//     const updatedFlag = req.body.fg_done ? 1 : 0; 
  
//     db.query(sql, [updatedFlag, id], (err, result) => {
//       if(err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({Message: 'Error update todo flag', Error: err});
//       } else {
//         req.query.partyId = req.body.id_party;
//         getTodos(req, res);
//       }
//     });
// };


export const deletePartyGuest = (req, res) => {
    const sql = `DELETE FROM TB_PARTY_GUEST
                       WHERE id_party = ?
                         AND id_guest = ?;`;

      const idParty = req.body.partyId;
      const idGuest = req.params.id;

      db.query(sql, [idParty, idGuest], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.json({Message: 'Error delete todo', Error: err});
      } else {
        req.query.partyId = idParty;
        getGuestList(req, res);
      }
    }); 
};


export const deleteGuestByParty = (partyId) => {
  return new Promise((resolve, reject) => {

    const sql = 'DELETE FROM TB_PARTY_GUEST WHERE id_party = ?;';

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

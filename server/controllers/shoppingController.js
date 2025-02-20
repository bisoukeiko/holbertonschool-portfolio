import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import ShoppingValidator from '../validators/ShoppingValidator.js';


export const getShopping = (req, res) => {
  const { partyId }  = req.query;
    const sql = `SELECT id_item,
                        id_party,
                        shop_item,
                        shop_fg_done
                   FROM TB_SHOPPING
                  WHERE id_party = ?
               ORDER BY created_at desc;`
  db.query(sql, [partyId], (err, result)=> {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error select shopping', Error: err});
      }
      return res.status(201).json(result);
    });
};


export const addShopping = (req, res) => {

  const { id_party, valueItem } = req.body;
  const validator = new ShoppingValidator(valueItem);
  if (!validator.validate()) {
    // console.log(validator.getErrors());
    return res.status(400).json({errors: validator.getErrors()});
  }

  const sql = `INSERT INTO TB_SHOPPING 
                       (id_item,
                        id_party,
                        shop_item,
                        shop_fg_done)
                VALUES (?, ?, ?, ?);`;

  // console.log('insert', req.body);
  const values = [
        uuidv4(),
        id_party,
        valueItem,
        false
  ];

  db.query(sql, values, (err, result) => {
    if(err) {
      console.error('Error insertion shopping:', err);
      return res.status(500).json({ error: 'Error insert shopping' });
    } else {
      req.query.partyId = req.body.id_party;
      getShopping(req, res);
    }
  });
};


export const updateShopping = (req, res) => {

    const { valueItem } = req.body;
    const validator = new ShoppingValidator(valueItem);
    if (!validator.validate()) {
      // console.log(validator.getErrors());
      return res.status(400).json({errors: validator.getErrors()});
    }

    const sql = 'UPDATE TB_SHOPPING SET shop_item = ? WHERE id_item=?;';
    const id = req.params.id;
    db.query(sql, [valueItem, id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error update shopping', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getShopping(req, res);
      }
    });
};


export const updateShoppingFlag = (req, res) => {
    const sql = 'UPDATE TB_SHOPPING SET shop_fg_done=? WHERE id_item=?;';
    const id = req.params.id;
  
    // shop_fg_done を数値で扱うため、0/1 に変換
    const updatedFlag = req.body.shop_fg_done ? 1 : 0; 
  
    db.query(sql, [updatedFlag, id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.status(500).json({Message: 'Error update shopping flag', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getShopping(req, res);
      }
    });
};


export const deleteShopping = (req, res) => {
    const sql = 'DELETE FROM TB_SHOPPING WHERE id_item = ?;';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
      if(err) {
        console.error("Database Error:", err);
        return res.json({Message: 'Error delete shopping', Error: err});
      } else {
        req.query.partyId = req.body.id_party;
        getShopping(req, res);
      }
    }); 
};


export const deleteShoppingByParty = (partyId) => {
  return new Promise((resolve, reject) => {

    const sql = 'DELETE FROM TB_SHOPPING WHERE id_party = ?;';

    db.query(sql, [partyId], (err, result) => {
      if(err) {
        console.error("Error delete shopping by party id", err);
        return reject(err);
      } else {
        resolve(result);
      }
    });
  }); 
};

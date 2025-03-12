import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import ShoppingValidator from '../validators/ShoppingValidator.js';


export const getShopping = (req, res) => {
  const { partyId }  = req.query;
    const sql = `SELECT TBS.id_item,
                        TBS.id_party,
                        TBS.shop_item,
                        TBS.shop_fg_done
                   FROM TB_SHOPPING AS TBS,
                        TB_PARTY AS TBP
                  WHERE TBS.id_party = ?
                    AND TBS.id_party = TBP.id_party
                    AND TBP.delete_at IS NULL
               ORDER BY TBS.created_at ASC;`
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


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const addInitialItems = async (partyId) => {
  const initialItems = [
    'Birthday Cake',
    'Birthday Candles',
    'Candies, Chocolates, Cookies',
    'Drinks (Juice, Soda, Water)',
    'Plates, Cups, Napkins',
    'Balloons'
  ];

  const sql = `INSERT INTO TB_SHOPPING 
                  (id_item, id_party, shop_item, shop_fg_done) 
               VALUES (?, ?, ?, ?);`;

  try {
    for (const item of initialItems) {
      const values = [uuidv4(), partyId, item, false];

      await delay(200);

      await new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) {
            console.error("Error inserting shopping item:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }

    return;
  } catch (err) {
    throw new Error("Error inserting shopping items: " + err);
  }
};
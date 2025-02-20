import express from 'express';
import { getShopping, addShopping, updateShopping, updateShoppingFlag, deleteShopping, deleteShoppingByParty } from '../controllers/shoppingController.js';

const router = express.Router();

router.get('/select', getShopping);
router.post('/insert', addShopping);
router.put('/update/:id', updateShopping);
router.put('/updateFlag/:id', updateShoppingFlag);
router.delete('/delete/:id', deleteShopping);
router.delete('/deleteByParty/:id', deleteShoppingByParty);

export default router;

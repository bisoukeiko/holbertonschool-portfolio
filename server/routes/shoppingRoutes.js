import express from 'express';
import { getShopping, addShopping, updateShopping, updateShoppingFlag, deleteShopping, deleteShoppingByParty, addInitialItems } from '../controllers/shoppingController.js';

const router = express.Router();

router.get('/select', getShopping);
router.post('/insert', addShopping);
router.post('/addInitialItems', addInitialItems);
router.put('/update/:id', updateShopping);
router.put('/updateFlag/:id', updateShoppingFlag);
router.delete('/delete/:id', deleteShopping);
router.delete('/deleteByParty/:id', deleteShoppingByParty);

export default router;

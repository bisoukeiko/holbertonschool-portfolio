import express from 'express';
import { insertParty, updateParty, deleteParty } from '../controllers/partyController.js';

const router = express.Router();

router.post('/insert', insertParty);
router.put('/update/:partyId', updateParty);
router.delete('/delete/:partyId', deleteParty);

export default router;

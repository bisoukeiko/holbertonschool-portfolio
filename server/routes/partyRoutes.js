import express from 'express';
import { selectParty, selectPartyByChild, insertParty, updateParty, deleteParty } from '../controllers/partyController.js';

const router = express.Router();

router.get('/select', selectParty);
router.get('/selectByIdChild', selectPartyByChild);
router.post('/insert', insertParty);
router.put('/update/:partyId', updateParty);
router.delete('/delete/:partyId', deleteParty);

export default router;

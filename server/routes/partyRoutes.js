import express from 'express';
import { selectParty, selectPartyByChild, insertParty, updateParty, deleteParty, updateFolder, updateInvitation } from '../controllers/partyController.js';

const router = express.Router();

router.get('/select', selectParty);
router.get('/selectByIdChild', selectPartyByChild);
router.post('/insert', insertParty);
router.put('/update/:partyId', updateParty);
router.put('/updateFolder/:partyId', updateFolder);
router.put('/updateInvitation/:partyId', updateInvitation);
router.delete('/delete/:partyId', deleteParty);

export default router;

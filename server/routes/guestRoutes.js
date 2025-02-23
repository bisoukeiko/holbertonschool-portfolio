import express from 'express';
import { getGuestList, getAllGuestList, addGuest, updateGuest, deletePartyGuest, deleteGuestByParty } from '../controllers/guestController.js';
// updateGuestFlag

const router = express.Router();

router.get('/select', getGuestList);
router.get('/selectAllGuest', getAllGuestList);
router.post('/insert', addGuest);
router.put('/update/:id', updateGuest);
// router.put('/updateFlag/:id', updateGuestFlag);
router.delete('/deletePartyGuest/:id', deletePartyGuest);
router.delete('/deleteByParty/:id', deleteGuestByParty);

export default router;

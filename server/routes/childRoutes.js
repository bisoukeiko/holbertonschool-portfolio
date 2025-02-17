import express from 'express';
import { getChildByIdUser, insertChild, updateChild, deleteChild , getChildParty } from '../controllers/childController.js';
// , getChildByIdchild

const router = express.Router();

router.get('/selectByIdUser', getChildByIdUser);
router.get('/selectChildParty', getChildParty);
router.post('/insert', insertChild);
router.put('/update/:childId', updateChild);
router.delete('/delete/:childId', deleteChild);

export default router;

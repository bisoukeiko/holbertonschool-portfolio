import express from 'express';
import { getChildByIdUser, insertChild, updateChild, deleteChild } from '../controllers/childController.js';
// , getChildByIdchild

const router = express.Router();

router.get('/selectByIdUser', getChildByIdUser);
// router.get('/selectByIdChild', getChildByIdchild);
router.post('/insert', insertChild);
router.put('/update/:childId', updateChild);
router.delete('/delete/:childId', deleteChild);

export default router;

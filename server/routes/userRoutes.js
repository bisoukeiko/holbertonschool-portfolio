import express from 'express';
import { getUserByGoogleId, getUserById, insertUser, updateUser } from '../controllers/userController.js';


const router = express.Router();

router.get('/select', getUserByGoogleId);
router.get('/selectById', getUserById);
router.post('/insert', insertUser);
router.put('/update', updateUser);


export default router;

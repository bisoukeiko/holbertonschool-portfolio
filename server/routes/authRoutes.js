import express from 'express';
import { getGoogleToken } from '../controllers/authController.js';


const router = express.Router();

router.post('/google', getGoogleToken);

export default router;

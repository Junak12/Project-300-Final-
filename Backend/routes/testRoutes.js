import express from 'express';
import { getTests } from '../controllers/testController.js';

const router = express.Router();

router.get('/tests', getTests);

export default router;

import express from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/paymentController.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

router.post('/create-payment-intent', authUser, createPaymentIntent);
router.post('/confirm-payment', authUser, confirmPayment);

export default router;

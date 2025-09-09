import express from 'express';
import {
  bookTestAppointment,
  createPaymentIntent,
  confirmPayment,
  getMyTestAppointments,
} from '../controllers/testAppointmentController.js';

import authUser from '../middleware/authUser.js';

const router = express.Router();

router.post('/book', authUser, bookTestAppointment);
router.post('/create-payment-intent', authUser, createPaymentIntent);
router.post('/confirm-payment', authUser, confirmPayment);
router.get('/my-tests', authUser, getMyTestAppointments);

export default router;

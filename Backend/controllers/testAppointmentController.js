import TestAppointment from '../models/TestAppointment.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const bookTestAppointment = async (req, res) => {
  try {
    const {
      testName,
      fee,
      testDate,
      timeSlot,
      patientName,
      patientAge,
      patientGender,
    } = req.body;

    if (
      !testName ||
      fee == null ||
      !testDate ||
      !timeSlot ||
      !patientName ||
      patientAge == null ||
      !patientGender
    ) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const appointment = new TestAppointment({
      userId: req.user.userId,
      testName,
      fee,
      testDate,
      timeSlot,
      patientName,
      patientAge,
      patientGender,
      paymentIntentId: null,   // no payment yet
      paymentStatus: 'pending' // mark as unpaid initially
    });

    await appointment.save();

    res.status(201).json({ success: true, message: 'Test appointment booked successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMyTestAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const appointments = await TestAppointment.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Fetching appointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { fee } = req.body;

    if (!fee || fee <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid fee amount' });
    }

    const amountInCents = Math.round(fee * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: { userId: req.user.userId, integration_check: 'accept_a_payment' },
    });

    res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ success: false, message: 'Payment intent creation failed' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { appointmentId, paymentIntentId } = req.body;

    if (!appointmentId || !paymentIntentId) {
      return res.status(400).json({ success: false, message: "Missing appointmentId or paymentIntentId" });
    }

    const appointment = await TestAppointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.paymentIntentId = paymentIntentId;
    appointment.paymentStatus = "succeeded";

    await appointment.save();

    res.status(200).json({ success: true, message: "Payment confirmed" });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ success: false, message: "Server error during payment confirmation" });
  }
};

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // your Stripe secret key

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // or your currency
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment intent' });
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

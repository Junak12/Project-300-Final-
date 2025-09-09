import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51RuI9APDXCxxQd1hcwxouiJzvkC4612MqADlJHoPZQGzXjBeUhMotAUNlcUkouzJT69id0lchBwq5ouEC9fjR1Az005cLGSalK');

function CheckoutForm({ clientSecret, onPaymentSuccess, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
      },
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success(`Payment of $${amount} successful!`);
      setProcessing(false);
      onPaymentSuccess(paymentIntent.id);  // Pass paymentIntentId here
    }
  };

  const ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937",
        "::placeholder": { color: "#9ca3af" },
        fontFamily: "ui-sans-serif, system-ui, -apple-system",
      },
      invalid: {
        color: "#ef4444",
      },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto"
      style={{ maxWidth: "450px" }}
    >
      <div className="mb-4 text-center font-semibold text-gray-700">
        Amount to pay: <span className="text-blue-600">${amount}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 border rounded p-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Card Number</label>
          <CardNumberElement options={ELEMENT_OPTIONS} />
        </div>

        <div className="w-24 border rounded p-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Expiry</label>
          <CardExpiryElement options={ELEMENT_OPTIONS} />
        </div>

        <div className="w-24 border rounded p-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">CVC</label>
          <CardCvcElement options={ELEMENT_OPTIONS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 rounded text-white font-semibold transition-colors ${
          processing ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
}

function Mytest() {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingAppointment, setPayingAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [payAmount, setPayAmount] = useState(0);

  // Scroll to top on mount and whenever payingAppointment changes (payment form shows)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [payingAppointment]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchMyTests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${backendUrl}/api/test-appointments/my-tests`, {
          headers: { token },
        });

        if (res.data.success) {
          setAppointments(res.data.appointments);
        } else {
          setError(res.data.message || "Failed to fetch appointments");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error fetching data");
      }
      setLoading(false);
    };

    if (token) {
      fetchMyTests();
    } else {
      setLoading(false);
      setError("User not authenticated.");
    }
  }, [backendUrl, token]);

  // Create payment intent & start payment process
  const handlePayClick = async (appointmentId, amount) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/test-appointments/create-payment-intent`,
        { fee: amount }, // amount in cents
        { headers: { token } }
      );

      if (res.data.success) {
        setClientSecret(res.data.clientSecret);
        setPayingAppointment(appointmentId);
        setPayAmount(amount / 100); // convert cents to dollars for display
      } else {
        toast.error(res.data.message || "Failed to create payment intent");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Payment failed");
    }
  };

  // Called after payment succeeds, send appointmentId and paymentIntentId to backend
  const onPaymentSuccess = async (paymentIntentId) => {
    try {
      await axios.post(
        `${backendUrl}/api/test-appointments/confirm-payment`,
        {
          appointmentId: payingAppointment,
          paymentIntentId: paymentIntentId,
        },
        { headers: { token } }
      );

      toast.success("Payment confirmed!");
      setPayingAppointment(null);
      setClientSecret("");
      setPayAmount(0);

      // Refresh appointments
      const res = await axios.get(`${backendUrl}/api/test-appointments/my-tests`, {
        headers: { token },
      });
      if (res.data.success) setAppointments(res.data.appointments);
    } catch (error) {
      toast.error("Failed to confirm payment: " + error.message);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-xl font-semibold">Loading your test appointments...</div>;
  if (error) return <div className="text-center mt-20 text-red-600 text-lg">{error}</div>;
  if (appointments.length === 0)
    return <div className="text-center mt-20 text-lg font-medium">You have no test appointments booked.</div>;

  return (
    <div
      className="max-w-4xl mx-auto mt-24 p-8 bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 rounded-3xl shadow-lg ring-1 ring-purple-300 min-h-screen"
    >
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-800">My Test Appointments</h1>

      {payingAppointment && clientSecret ? (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            onPaymentSuccess={onPaymentSuccess}
            amount={payAmount}
          />
        </Elements>
      ) : (
        <ul className="space-y-6">
          {appointments.map((appt) => (
            <li
              key={appt._id}
              className="border border-purple-300 rounded-xl bg-white p-6 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col gap-3"
            >
              <p className="text-lg font-semibold text-purple-700">Test Name: <span className="font-normal text-gray-800">{appt.testName}</span></p>
              <p className="text-purple-700">
                Test Date: <span className="font-normal text-gray-800">{new Date(appt.testDate).toLocaleDateString()}</span>
              </p>
              <p className="text-purple-700">
                Time Slot: <span className="font-normal text-gray-800">{appt.timeSlot}</span>
              </p>
              <p className="text-purple-700">
                Fee: <span className="font-semibold text-blue-600">${appt.fee.toFixed(2)}</span>
              </p>
              <p className="text-purple-700">
                Patient Name: <span className="font-normal text-gray-800">{appt.patientName}</span>
              </p>
              <p className="text-purple-700">
                Patient Age: <span className="font-normal text-gray-800">{appt.patientAge}</span>
              </p>
              <p className="text-purple-700">
                Patient Gender: <span className="font-normal text-gray-800">{appt.patientGender}</span>
              </p>
              <p className="text-purple-700">
                Payment Status:{" "}
                <span
                  className={`font-semibold ${
                    appt.paymentStatus === "succeeded" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {appt.paymentStatus || "pending"}
                </span>
              </p>

              {!appt.paymentStatus || appt.paymentStatus !== "succeeded" ? (
                <button
                  className="mt-4 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors shadow-lg"
                  onClick={() => handlePayClick(appt._id, appt.fee * 100)} // convert dollars to cents
                >
                  Pay Now
                </button>
              ) : (
                <span className="mt-4 text-green-700 font-semibold">Paid</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Mytest;

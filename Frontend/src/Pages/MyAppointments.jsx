import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

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
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success(`Payment of ${amount} successful!`);
      setProcessing(false);
      onPaymentSuccess(); // call after success
    }
  };

  const ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1f2937',
        '::placeholder': { color: '#9ca3af' },
        fontFamily: 'ui-sans-serif, system-ui, -apple-system',
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto"
      style={{ maxWidth: '450px' }}
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
          processing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
}

function MyAppointments() {
  const { backendUrl, token, currencySymbol, getDoctorData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [payingAppointment, setPayingAppointment] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [payAmount, setPayAmount] = useState(0);

  const months = ['', 'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2];
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment',
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        setClientSecret(data.clientSecret);
        setPayingAppointment(appointmentId);
        const appointment = appointments.find((a) => a._id === appointmentId);
        setPayAmount(appointment ? appointment.docData.fees : 0);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onPaymentSuccess = async () => {
    try {
      await axios.post(
        backendUrl + '/api/user/confirm-payment',
        { appointmentId: payingAppointment },
        { headers: { token } }
      );

      toast.success('Payment recorded successfully!');
      setPayingAppointment(null);
      setClientSecret('');
      setPayAmount(0);
      getUserAppointments();
      getDoctorData();
    } catch (error) {
      toast.error('Database update failed: ' + error.message);
    }
  };

  return (
    <div className="mt-24 px-4 md:px-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h2>
      <hr />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.slice(0, 3).map((item) => (
          <div
            key={item._id}
            className="relative bg-gradient-to-tr from-white via-blue-50 to-white shadow-md rounded-2xl p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex gap-4 items-center">
              <img
                src={item.docData.image || 'fallback-image-url.jpg'}
                alt={item.docData.name}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <div>
                <p className="text-lg font-semibold text-gray-900">{item.docData.name}</p>
                <p className="text-sm text-gray-600">{item.docData.speciality || item.docData.specialization}</p>
                <p className="text-sm font-medium text-blue-600">
                  {currencySymbol}
                  {item.docData.fees}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p className="font-medium text-gray-800">Address:</p>
              {item.docData.address ? (
                <>
                  <p>{item.docData.address.line1}</p>
                  <p>{item.docData.address.line2}</p>
                  <p>
                    {item.docData.address.city}, {item.docData.address.state} - {item.docData.address.zip}
                  </p>
                </>
              ) : (
                <p>Address not provided</p>
              )}
            </div>

            <div className="mt-2 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-800">Date and Time:</span> {slotDateFormat(item.slotDate)} |{' '}
                {item.slotTime}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              {item.cancelled ? (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded font-bold text-red-500 cursor-pointer hover:bg-red-700">
                  Appointment Cancelled
                </button>
              ) : item.payment && item.isCompleted ? (
                <button className="sm:min-w-48 py-2 border border-green-600 rounded font-bold text-green-600 cursor-default">
                  Appointment Completed
                </button>
              ) : (
                !item.payment &&
                !item.isCompleted && (
                  <>
                    <button
                      type="button"
                      onClick={() => appointmentStripe(item._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-sm cursor-pointer"
                    >
                      Pay Online
                    </button>
                    <button
                      type="button"
                      onClick={() => cancelAppointment(item._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                )
              )}
            </div>

            {payingAppointment === item._id && clientSecret && (
              <div className="mt-6">
                <Elements stripe={stripePromise}>
                  <CheckoutForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} amount={payAmount} />
                </Elements>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;

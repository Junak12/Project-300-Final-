import React, { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = 'http://localhost:3000'; // change if needed

const TestAppointments = () => {
  const [testAppointments, setTestAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTestAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const adminToken = localStorage.getItem('aToken');  // get token from localStorage

      if (!adminToken) {
        setError('Admin token missing. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backendUrl}/api/admin/test-appointments`, {
        headers: {
          atoken: adminToken,  // send token as 'atoken' header (lowercase)
        },
      });

      if (response.data.success) {
        setTestAppointments(response.data.testAppointments);
      } else {
        setError(response.data.message || 'Failed to fetch test appointments');
      }
    } catch (err) {
      // handle errors from axios or server
      setError(err.response?.data?.message || err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestAppointments();
  }, []);

  if (loading) return <p>Loading test appointments...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test Appointments</h2>
      {testAppointments.length === 0 ? (
        <p>No test appointments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Test Name</th>
              <th className="border border-gray-300 p-2">Patient Name</th>
              <th className="border border-gray-300 p-2">Age</th>
              <th className="border border-gray-300 p-2">Gender</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Time Slot</th>
              <th className="border border-gray-300 p-2">Fee</th>
              <th className="border border-gray-300 p-2">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {testAppointments.map((app) => (
              <tr key={app._id}>
                <td className="border border-gray-300 p-2">{app.testName}</td>
                <td className="border border-gray-300 p-2">{app.patientName || app.userData?.name || '-'}</td>
                <td className="border border-gray-300 p-2">{app.patientAge || '-'}</td>
                <td className="border border-gray-300 p-2">{app.patientGender || '-'}</td>
                <td className="border border-gray-300 p-2">{new Date(app.testDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 p-2">{app.timeSlot}</td>
                <td className="border border-gray-300 p-2">${app.fee}</td>
                <td className="border border-gray-300 p-2 capitalize">{app.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestAppointments;

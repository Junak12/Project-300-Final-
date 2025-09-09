import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";

const availableTests = [
  { name: "Blood Test", fee: 50 },
  { name: "Urine Test", fee: 30 },
  { name: "X-Ray", fee: 100 },
  { name: "MRI", fee: 250 },
];

function Test() {
  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    testName: "",
    testDate: "",
    timeSlot: "",
    patientName: "",
    patientAge: "",
    patientGender: "",
    fee: 0,
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:00 - ${(hour + 1)
          .toString()
          .padStart(2, "0")}:00`
      );
    }
    setTimeSlots(slots);
  }, []);

  useEffect(() => {
    if (formData.testName) {
      const test = availableTests.find((t) => t.name === formData.testName);
      setFormData((prev) => ({
        ...prev,
        fee: test ? test.fee : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, fee: 0 }));
    }
  }, [formData.testName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.patientAge || Number(formData.patientAge) <= 0) {
      setError("Please enter a valid patient age.");
      return;
    }

    try {
      const dataToSend = {
        testName: formData.testName,
        fee: formData.fee,
        testDate: formData.testDate,
        timeSlot: formData.timeSlot,
        patientName: formData.patientName,
        patientAge: Number(formData.patientAge),
        patientGender: formData.patientGender,
      };

      const res = await axios.post(`${backendUrl}/api/test-appointments/book`, dataToSend, {
        headers: { token },
      });

      if (res.data.success) {
        setMessage("Test appointment booked successfully!");
        navigate("/my-test");
      } else {
        setError(res.data.message || "Booking failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error submitting form");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-xl mx-auto mt-24 p-8 rounded-2xl shadow-xl bg-gradient-to-tr from-indigo-50 via-white to-teal-50">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center tracking-tight">
        Book Test Appointment
      </h1>

      {message && (
        <div className="mb-6 rounded-md bg-green-100 border border-green-300 p-4 text-green-800 font-semibold">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-md bg-red-100 border border-red-300 p-4 text-red-800 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Grid container for inputs */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">

          {/* Test Name */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Test
            </span>
            <select
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              required
              className="appearance-none bg-transparent border-b border-gray-300 py-2 text-lg font-medium text-gray-900
                focus:border-teal-500 focus:outline-none transition"
            >
              <option value="" disabled>
                Select Test
              </option>
              {availableTests.map((test) => (
                <option key={test.name} value={test.name}>
                  {test.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Fee ($)
            </span>
            <div className="py-2 text-lg font-medium text-gray-700 select-none">
              {formData.fee}
            </div>
          </div>

          {/* Test Date */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Date
            </span>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              min={today}
              required
              className="border-b border-gray-300 py-2 text-lg font-medium text-gray-900 bg-transparent
                focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Time Slot */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Time Slot
            </span>
            <select
              name="timeSlot"
              value={formData.timeSlot}
              onChange={handleChange}
              required
              className="appearance-none bg-transparent border-b border-gray-300 py-2 text-lg font-medium text-gray-900
                focus:border-teal-500 focus:outline-none transition"
            >
              <option value="" disabled>
                Select Time Slot
              </option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Name */}
          <div className="flex flex-col col-span-2">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Patient Name
            </span>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleChange}
              required
              className="border-b border-gray-300 py-2 text-lg font-medium text-gray-900 bg-transparent
                focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Patient Age */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Age
            </span>
            <input
              type="number"
              name="patientAge"
              placeholder="Age"
              value={formData.patientAge}
              onChange={handleChange}
              min={0}
              required
              className="border-b border-gray-300 py-2 text-lg font-medium text-gray-900 bg-transparent
                focus:border-teal-500 focus:outline-none transition"
            />
          </div>

          {/* Patient Gender */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              Gender
            </span>
            <select
              name="patientGender"
              value={formData.patientGender}
              onChange={handleChange}
              required
              className="appearance-none bg-transparent border-b border-gray-300 py-2 text-lg font-medium text-gray-900
                focus:border-teal-500 focus:outline-none transition"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-teal-400 to-blue-600 text-white font-bold rounded-xl
          shadow-lg hover:from-blue-600 hover:to-teal-400 transition-colors duration-300"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default Test;

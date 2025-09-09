import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointment, getAllAppointments, appointmentCancel } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 bg-gray-200 p-3 rounded-t font-semibold text-gray-700 sticky top-0 z-10">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {/* Table rows */}
        {appointment.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-7 gap-4 p-3 border-b items-center hover:bg-gray-50"
          >
            <p>{index + 1}</p>

            <div className="flex items-center space-x-3">
              <img
                src={item.userData.image}
                alt={item.userData.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>{item.userData.name}</p>
            </div>

            <p>{calculateAge(item.userData.dob)}</p>

            <p>
              {slotDateFormat(item.slotDate)} | {item.slotTime}
            </p>

            <div className="flex items-center space-x-3">
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p>{item.docData.name}</p>
            </div>

            <p>
              {currency} {item.docData.fees}
            </p>

            <div>
              {item.cancelled ? (
                <p className="text-red-500 font-semibold">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-600 font-semibold">Appointment Completed</p>
              ) : (
                <img
                  src={assets.cancel_icon}
                  alt="Cancel"
                  className="w-15 h-15 cursor-pointer hover:opacity-10"
                  onClick={() => appointmentCancel(item._id)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAppointments;

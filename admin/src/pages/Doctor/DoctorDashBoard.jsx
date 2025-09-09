import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorDashBoard = () => {
  const { dashData, getDashData, dToken, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
      
    }
  }, [dToken]);

  if (!dashData) return null;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Earnings */}
        <div className="flex items-center gap-4 bg-white shadow-sm rounded-lg p-4">
          <img src={assets.earning_icon} alt="Earnings" className="w-12 h-12" />
          <div>
            <p className="text-xl font-semibold">{currency}{dashData.earnings}</p>
            <p className="text-gray-500">Earnings</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center gap-4 bg-white shadow-sm rounded-lg p-4">
          <img src={assets.appointments_icon} alt="Appointments" className="w-12 h-12" />
          <div>
            <p className="text-xl font-semibold">{dashData.appointments}</p>
            <p className="text-gray-500">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center gap-4 bg-white shadow-sm rounded-lg p-4">
          <img src={assets.patients_icon} alt="Patients" className="w-12 h-12" />
          <div>
            <p className="text-xl font-semibold">{dashData.patients}</p>
            <p className="text-gray-500">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex items-center gap-3 border-b pb-3 mb-4">
          <img src={assets.list_icon} alt="Latest Bookings" className="w-6 h-6" />
          <p className="text-lg font-semibold">Latest Bookings</p>
        </div>

        <div className="space-y-4">
          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 last:border-b-0"
            >
              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold">{item.userData.name}</p>
                  <p className="text-gray-500 text-sm">{slotDateFormat(item.slotDate)}</p>
                </div>
              </div>

              {/* Status / Actions */}
              {item.cancelled ? (
                <p className="text-red-600 font-semibold">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-600 font-semibold">Completed</p>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="p-2 rounded-full hover:bg-red-100"
                  >
                    <img src={assets.cancel_icon} alt="Cancel" className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => completeAppointment(item._id)}
                    className="p-2 rounded-full hover:bg-green-100"
                  >
                    <img src={assets.tick_icon} alt="Complete" className="w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashBoard;

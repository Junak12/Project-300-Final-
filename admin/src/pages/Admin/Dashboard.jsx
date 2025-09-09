import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  if (!dashData) {
    return <p className="m-5 text-center text-gray-500">Loading dashboard data...</p>;
  }

  return (
    <div className="m-5 space-y-10">
      {/* Summary Stats */}
      <div className="flex flex-wrap justify-center gap-10">
        {/* Doctors */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-xl shadow-md w-56 hover:shadow-xl transition-shadow">
          <img src={assets.doctor_icon} alt="Doctors" className="w-14 h-14" />
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-extrabold text-gray-800">{dashData.doctors}</p>
            <p className="text-gray-500 uppercase tracking-wide">Doctors</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-xl shadow-md w-56 hover:shadow-xl transition-shadow">
          <img src={assets.appointment_icon} alt="Appointments" className="w-14 h-14" />
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-extrabold text-gray-800">{dashData.appointments}</p>
            <p className="text-gray-500 uppercase tracking-wide">Appointments</p>
          </div>
        </div>

        {/* Patients */}
        <div className="flex items-center gap-5 bg-white p-6 rounded-xl shadow-md w-56 hover:shadow-xl transition-shadow">
          <img src={assets.patients_icon} alt="Patients" className="w-14 h-14" />
          <div className="flex flex-col justify-center">
            <p className="text-3xl font-extrabold text-gray-800">{dashData.patients}</p>
            <p className="text-gray-500 uppercase tracking-wide">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <img src={assets.list_icon} alt="Latest Bookings" className="w-7 h-7" />
          <p className="text-xl font-semibold tracking-wide">Latest Bookings</p>
        </div>

        <div className="space-y-5 max-w-4xl mx-auto">
          {dashData.latestAppointments.length === 0 && (
            <p className="text-center text-gray-500 italic">No recent appointments found.</p>
          )}

          {dashData.latestAppointments.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={item.docData.image}
                alt={item.docData.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
              />

              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900">{item.docData.name}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              <div className="min-w-[110px] text-center">
                {item.cancelled ? (
                  <span className="inline-block px-3 py-1 text-red-600 font-semibold rounded-full bg-red-100 uppercase tracking-wide select-none">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="inline-block px-3 py-1 text-green-600 font-semibold rounded-full bg-green-100 uppercase tracking-wide select-none">
                    Appointment Completed
                  </span>
                ) : (
                  <img
                    src={assets.cancel_icon}
                    alt="Cancel"
                    className="w-7 h-7 cursor-pointer hover:opacity-60 transition-opacity"
                    onClick={() => cancelAppointment(item._id)}
                    title="Cancel Appointment"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

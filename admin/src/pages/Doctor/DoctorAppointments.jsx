import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      
    }
  }, [dToken]);

  if (appointments.length === 0) {
    return (
      <div className="p-4 max-w-7xl mx-auto text-center text-gray-500 text-lg">
        No appointments found.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">All Appointments</h2>

      {/* TABLE: visible on medium and larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-red-100 text-red-600">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Patient</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Date &amp; Time</th>
              <th className="py-3 px-4 text-left">Fees</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.reverse().map((item, index) => (
              <tr
                key={item._id || index}
                className="border-t border-gray-200 hover:bg-red-50 transition"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    alt={item.userData.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                  <span>{item.userData.name}</span>
                </td>
                <td className="py-3 px-4">{item.payment ? 'Online' : 'Cash'}</td>
                <td className="py-3 px-4">{calculateAge(item.userData.dob)}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </td>
                <td className="py-3 px-4">
                  {currency}
                  {item.amount}
                </td>
                <td className=" -mt-10  py-3 px-4 flex gap-3 items-center">
                  {item.cancelled ? (
                    <p  className="-mt-10 text-red-600 font-semibold flex items-center">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className=" -mt-10 text-green-600 font-semibold flex items-center">
                      Completed
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="hover:bg-red-100 p-1 rounded cursor-pointer"
                        aria-label="Cancel Appointment"
                        onClick={() => cancelAppointment(item._id)}
                      >
                        <img src={assets.cancel_icon} alt="Cancel" className="w-10 h-10" />
                      </button>
                      <button
                        type="button"
                        className="hover:bg-green-100 p-1 rounded cursor-pointer"
                        aria-label="Confirm Appointment"
                        onClick={() => completeAppointment(item._id)}
                      >
                        <img src={assets.tick_icon} alt="Confirm" className="w-10 h-10" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS: visible only on small screens */}
      <div className="sm:hidden flex flex-col gap-4">
        {appointments.map((item, index) => (
          <div
            key={item._id || index}
            className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-red-600 font-semibold text-lg">{index + 1}.</div>
              <img
                src={item.userData.image}
                alt={item.userData.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-base">{item.userData.name}</span>
                <span className="text-gray-500 text-sm">{item.payment ? 'Online' : 'Cash'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Age: </span>
                {calculateAge(item.userData.dob)}
              </div>
              <div>
                <span className="font-semibold">Fees: </span>
                {currency}{item.amount}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              {item.cancelled ? (
                <p className="text-red-600 font-semibold flex items-center">
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className="text-green-600 font-semibold flex items-center">
                  Completed
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded cursor-pointer hover:bg-red-200"
                    aria-label="Cancel Appointment"
                    onClick={() => cancelAppointment(item._id)}
                  >
                    <img src={assets.cancel_icon} alt="Cancel" className="w-6 h-6" />
                    <span className="text-red-700 font-semibold">Cancel</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded cursor-pointer hover:bg-green-200"
                    aria-label="Confirm Appointment"
                    onClick={() => completeAppointment(item._id)}
                  >
                    <img src={assets.tick_icon} alt="Confirm" className="w-6 h-6" />
                    <span className="text-green-700 font-semibold">Confirm</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;

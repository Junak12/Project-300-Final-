import React, { useEffect, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">All Doctors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="w-32 h-32 rounded-full mb-4 bg-red-700 flex items-center justify-center overflow-hidden transition-all duration-300">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.speciality}</p>
            <div className="flex items-center mt-4 gap-2">
              <input
                onChange={() => changeAvailability(item._id)}
                type="checkbox"
                checked={item.available}
                className="w-4 h-4 accent-green-500"
              />
              <p className="text-sm text-gray-700">Available</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;

import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen w-64 bg-white shadow-md p-4">
      {aToken && (
        <ul className="space-y-4">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.home_icon} alt="dashboard" className="h-6 w-6" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/admin/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.appointment_icon} alt="appointments" className="h-6 w-6" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/admin/test-app"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.appointment_icon} alt="test appointments" className="h-6 w-6" />
            <p>Test Appointments</p>
          </NavLink>

          <NavLink
            to="/admin/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.add_icon} alt="add doctor" className="h-6 w-6" />
            <p>Add Doctor</p>
          </NavLink>

          <NavLink
            to="/admin/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.people_icon} alt="doctor list" className="h-6 w-6" />
            <p>Doctor List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="space-y-4">
          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.home_icon} alt="dashboard" className="h-6 w-6" />
            <p>Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctor-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.appointment_icon} alt="appointments" className="h-6 w-6" />
            <p>Appointments</p>
          </NavLink>

          <NavLink
            to="/doctor-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition hover:bg-gray-100 ${
                isActive ? 'bg-red-100 text-red-600 font-semibold' : 'text-gray-700'
              }`
            }
          >
            <img src={assets.people_icon} alt="doctor profile" className="h-6 w-6" />
            <p>Doctor Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

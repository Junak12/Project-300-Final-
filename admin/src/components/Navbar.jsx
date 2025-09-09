import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const {dToken,  setDToken} = useContext(DoctorContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img
          src={assets.Logo}
          alt="Logo"
          className="h-10 w-auto cursor-pointer hover:scale-105 transition-transform duration-200"
        />
        <div>
          <p className="text-xl font-semibold text-gray-800 hover:text-red-600 transition">
            Dashboard Panel
          </p>
          <p className="text-sm text-gray-600 border text-center border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100 cursor-pointer transition">
            {aToken ? 'Admin' : 'Doctor'}
          </p>
        </div>
      </div>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition duration-200 shadow-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;

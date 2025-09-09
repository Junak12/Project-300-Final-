import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext.jsx';

const Login = () => {
  const [state, setState] = useState('Admin');
  const {setAToken, backendUrl} = useContext(AdminContext);
  const {dToken, setDToken} = useContext(DoctorContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault(); 
    try {

      if (state === 'Admin') {
        const {data} = await axios.post(backendUrl + '/api/admin/login',{email, password});
        if (data.token) {
          console.log(data.token);
          
          setAToken(data.token);
          localStorage.setItem('aToken', data.token);
          toast.success('Admin login successful');
        } 
        else {
          toast.error('Invalid email or password');
        }
      }
      else {
        const {data} = await axios.post(backendUrl + '/api/doctor/login',{email, password});
        if (data.token) {
          console.log(data.token);
          
          setAToken(data.token);
          localStorage.setItem('dToken', data.token);
          toast.success('Doctor login successful');
        } 
        else {
          toast.error('Invalid email or password');
        }
      }


    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please try again.');
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <p className="text-2xl sm:text-3xl font-bold text-center mb-8">
          <span className="text-blue-600">{state}</span> Login
        </p>

        {/* Email Field */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-md text-sm sm:text-base font-medium hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        {/* Switch Login Type */}
        <p className="text-sm text-center mt-6 text-gray-700">
          {state === 'Admin' ? (
            <>
              Doctor Login?{' '}
              <span
                onClick={() => setState('Doctor')}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          ) : (
            <>
              Admin Login?{' '}
              <span
                onClick={() => setState('Admin')}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login

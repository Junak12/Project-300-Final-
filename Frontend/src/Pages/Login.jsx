import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { AppContext } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Login() {

  const {backendUrl, token, setToken} = useContext(AppContext)
  const [state, setState] = useState('Sign Up'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      if (state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/user/register', {name,password,email} );
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }

      else {
        const {data} = await axios.post(backendUrl + '/api/user/login', {password,email} );
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(()=> {
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <div>
    <div className="mt-[100px] flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-2xl font-bold text-gray-800">
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </p>
          <p className="text-gray-600 text-sm">
            Please {state === 'Sign Up' ? 'sign up' : 'login'} to get services
          </p>
        </div>

        {/* Name Field - Show only in Sign Up */}
        {state === 'Sign Up' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          {state === 'Sign Up' ? 'Sign Up' : 'Login'}
        </button>

        {/* Switch Between Sign Up & Login */}
        <p className="text-center text-sm text-gray-600 mt-4">
          {state === 'Sign Up' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <span
                onClick={() => setState('Sign Up')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Sign up here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
    </div>
    
  );
}

export default Login;

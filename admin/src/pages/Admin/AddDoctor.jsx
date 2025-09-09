import React, { useState, useContext, useRef } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {
  const fileInputRef = useRef(null);

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');
  const [degree, setDegree] = useState('');

  const { backendUrl, aToken } = useContext(AdminContext);

  // Scroll to top helper before showing toast
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const OnsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        scrollToTop();
        toast.error('Please upload a profile picture');
        return;
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('speciality', speciality);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
      formData.append('about', about);
      formData.append('degree', degree);

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        scrollToTop();
        toast.success(data.message);
        // Clear all input states
        scrollToTop();
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setSpeciality('General physician');
        setAddress1('');
        setAddress2('');
        setAbout('');
        setDegree('');
        setDocImg(false);

        // Clear file input manually
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }


      } else {
        toast.error(data.message);
        scrollToTop();
      }
    } catch (error) {
      scrollToTop();
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <form onSubmit={OnsubmitHandler} className="max-w-6xl mx-auto bg-white shadow-xl px-10 py-12 rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">👨‍⚕️ Add New Doctor</h2>

      {/* Upload Area */}
      <div className="flex justify-center mb-10">
        <label
          htmlFor="doc-img"
          className="flex flex-col items-center justify-center w-52 h-52 border-2 border-dashed border-gray-400 rounded-xl cursor-pointer hover:bg-gray-50 transition"
        >
          <img
            src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            alt="Upload"
            className="h-20 w-[120px] rounded-4xl mb-2 opacity-80"
          />
          <p className="text-gray-500 text-sm text-center font-medium">
            Upload <br /> Profile Picture
          </p>
          <input
            ref={fileInputRef}
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
        </label>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <Input
            label="Doctor Name"
            type="text"
            placeholder="Enter doctor's full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            label="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            options={[...Array(10)].map((_, i) => `${i + 1} Year${i > 0 ? 's' : ''}`)}
          />
          <Input
            label="Fees (₹)"
            type="number"
            placeholder="Consultation fees"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <Select
            label="Speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            options={[
              'General physician',
              'Gynecologist',
              'Dermatologist',
              'Pediatricians',
              'Neurologist',
              'Gastroenterologist',
            ]}
          />
          <Input
            label="Education"
            type="text"
            placeholder="e.g. MBBS, MD"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              placeholder="Address Line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full mb-3 border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
            <input
              type="text"
              placeholder="Address Line 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>
        </div>
      </div>

      {/* About Doctor */}
      <div className="mt-10">
        <label className="block text-sm font-semibold text-gray-700 mb-2">About Doctor</label>
        <textarea
          rows={5}
          placeholder="Describe qualifications, experience, and patient approach"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          required
          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-10">
        <button
          type="submit"
          className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition shadow-md"
        >
          ➕ Add Doctor
        </button>
      </div>
    </form>
  );
};

// Reusable Input component
const Input = ({ label, type, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
    />
  </div>
);

// Reusable Select component
const Select = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 px-4 py-2 rounded bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default AddDoctor;

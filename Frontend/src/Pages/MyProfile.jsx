import React, { useContext, useState } from 'react';
import Footer from '../components/Footer';
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

function MyProfile() {
  const { userData, setUserdata, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  // Function to update profile on backend
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address || {}));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    }
  };

  // Handle Edit / Save button click
  const handleEditSaveClick = async () => {
    if (isEdit) {
      await updateUserProfileData();
    } else {
      setIsEdit(true);
    }
  };

  if (!userData) return null;

  return (
    <div className="mt-[100px] px-4">
      <div className="max-w-lg mx-auto text-sm flex flex-col gap-4 bg-white p-6 shadow rounded-lg">
        {isEdit ? (
          <label htmlFor="image" className="inline-block relative cursor-pointer">
            <img
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
              className="w-80 h-80 rounded-full mx-auto object-cover"
            />
            {!image && (
              <img
                src={assets.upload_icon}
                alt="Upload Icon"
                className="absolute bottom-2 right-2 w-10 h-10 opacity-70"
              />
            )}
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              accept="image/*"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-80 h-80 bg-red-400 rounded-full mx-auto object-cover"
            src={userData.image}
            alt="Profile"
          />
        )}

        {isEdit ? (
          <input
            className="bg-gray-100 text-2xl font-medium text-center rounded p-2"
            type="text"
            value={userData.name}
            onChange={(e) => setUserdata((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <p className="font-semibold text-2xl text-center text-gray-800">{userData.name}</p>
        )}

        <hr className="border-gray-300" />

        {/* Contact Info */}
        <div>
          <p className="text-lg font-semibold text-gray-700 underline mb-2">Contact Information</p>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 text-gray-600">
            <p>Email:</p>
            <p>{userData.email}</p>

            <p>Phone:</p>
            {isEdit ? (
              <input
                type="text"
                className="bg-gray-100 p-1 rounded"
                value={userData.phone}
                onChange={(e) => setUserdata((prev) => ({ ...prev, phone: e.target.value }))}
              />
            ) : (
              <p>{userData.phone}</p>
            )}

            <p>Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-2 col-span-1">
                <input
                  type="text"
                  className="bg-gray-100 p-1 rounded"
                  value={userData.address?.line1 || ''}
                  onChange={(e) =>
                    setUserdata((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  className="bg-gray-100 p-1 rounded"
                  value={userData.address?.line2 || ''}
                  onChange={(e) =>
                    setUserdata((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1 col-span-1">
                <p>{userData.address?.line1 || 'No Address Line 1'}</p>
                <p>{userData.address?.line2 || 'No Address Line 2'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div>
          <p className="text-lg font-semibold text-gray-700 underline mb-2">Basic Information</p>
          <div className="grid grid-cols-[120px_1fr] gap-y-3 text-gray-600">
            <p>Gender:</p>
            {isEdit ? (
              <select
                value={userData.gender}
                onChange={(e) => setUserdata((prev) => ({ ...prev, gender: e.target.value }))}
                className="bg-gray-100 p-1 rounded"
              >
                <option value="Not Selected">Not Selected</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="capitalize">{userData.gender}</p>
            )}

            <p>Date of Birth:</p>
            {isEdit ? (
              <input
                type="date"
                value={userData.dob === 'Not Selected' ? '' : userData.dob}
                onChange={(e) => setUserdata((prev) => ({ ...prev, dob: e.target.value }))}
                className="bg-gray-100 p-1 rounded"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleEditSaveClick}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEdit ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyProfile;

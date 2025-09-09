import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { profileData, getProfileData, dToken, setProfileData,backendUrl } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  useEffect(() => {
    if (profileData) {
      setTempProfile(profileData);
    }
  }, [profileData]);

  if (!profileData || !tempProfile) return null;

  const handleSave = () => {
    // Save updated profile data (call API or update context)
    setProfileData(tempProfile);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setTempProfile(profileData);
    setIsEdit(false);
  };

const updateProfile = async () => {
  try {
    const updateData = {
      fees: tempProfile.fees,
      address: tempProfile.address,
      available: tempProfile.available,
    };

    const { data } = await axios.post(
      `${backendUrl}/api/doctor/update-profile`,
      updateData,
      { headers: { Authorization: `Bearer ${dToken}` } }
    );

    if (data.success) {
      toast.success(data.message);
      setIsEdit(false);
      getProfileData();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
    console.log(error);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-7">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={tempProfile.image}
          alt={tempProfile.name}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-red-200"
        />
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <p className="text-2xl font-semibold text-gray-800">{tempProfile.name}</p>
          <div className="flex flex-wrap gap-2 items-center mt-1">
            <p className="text-gray-600">{tempProfile.degree} - {tempProfile.speciality}</p>
            <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">
              {tempProfile.experience}
            </span>
          </div>
        </div>
      </div>

      {/* About Section (display only) */}
      <div className="mt-6">
        <p className="text-lg font-medium text-gray-700 mb-1">About:</p>
        <p className="text-gray-600 leading-relaxed">{tempProfile.about}</p>
      </div>

      {/* Fees */}
      <div className="mt-4">
        <p className="text-lg font-medium text-gray-700">Consultation Fee:</p>
        {isEdit ? (
          <input
            type="number"
            value={tempProfile.fees}
            onChange={(e) => setTempProfile({ ...tempProfile, fees: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 w-32 text-gray-700"
          />
        ) : (
          <p className="text-xl font-bold text-red-600">
            {currency}{tempProfile.fees}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="mt-4">
        <p className="text-lg font-medium text-gray-700 mb-1">Address:</p>
        {isEdit ? (
          <>
            <input
              type="text"
              value={tempProfile.address.line1}
              onChange={(e) =>
                setTempProfile({
                  ...tempProfile,
                  address: { ...tempProfile.address, line1: e.target.value },
                })
              }
              className="border border-gray-300 rounded px-3 py-1 mb-2 w-full text-gray-700"
              placeholder="Address Line 1"
            />
            <input
              type="text"
              value={tempProfile.address.line2}
              onChange={(e) =>
                setTempProfile({
                  ...tempProfile,
                  address: { ...tempProfile.address, line2: e.target.value },
                })
              }
              className="border border-gray-300 rounded px-3 py-1 w-full text-gray-700"
              placeholder="Address Line 2"
            />
          </>
        ) : (
          <>
            <p className="text-gray-600">{tempProfile.address.line1}</p>
            <p className="text-gray-600">{tempProfile.address.line2}</p>
          </>
        )}
      </div>

      {/* Availability */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={tempProfile.available}
          onChange={(e) => setTempProfile({ ...tempProfile, available: e.target.checked })}
          className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-400 hover:cursor-pointer"
          disabled={!isEdit}
        />
        <label className="text-gray-700 cursor-pointer select-none">Available</label>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        {isEdit ? (
          <>
            <button
              onClick={updateProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg shadow"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;

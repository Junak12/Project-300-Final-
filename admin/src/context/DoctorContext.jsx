import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const loginDoctor = async (email, password) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
      if (data.success) {
        localStorage.setItem("dToken", data.token);
        setDToken(data.token);
        toast.success("Login successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAppointments = async () => {
    try {
      if (!dToken) {
        toast.error("You are not logged in");
        return;
      }
      console.log("Using token:", dToken);  // Debug token
      const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${dToken}` },  // <-- important!
      });
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async() => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/dashboard`,
        { headers: { Authorization: `Bearer ${dToken}` } }
      );
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
        
      }
      else {
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  const getProfileData = async() => {
    try {

      const { data } = await axios.get(
        `${backendUrl}/api/doctor/profile`,
        { headers: { Authorization: `Bearer ${dToken}` } }
      );

      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
        
      }
      else {

      }
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <DoctorContext.Provider
      value={{
        dToken,
        backendUrl,
        setDToken,
        loginDoctor,
        getAppointments,
        appointments,
        completeAppointment,
        cancelAppointment,
        dashData, setDashData, getDashData,
        profileData, setProfileData,getProfileData,
      }}
    >
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;

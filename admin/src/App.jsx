import { useState } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes,Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashBoard from './pages/Doctor/DoctorDashBoard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import TestAppointments from './pages/Admin/TestAppointments';

function App() {
  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext)
  return aToken  || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/*  admin routes*/}
          <Route path="path" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="admin/all-appointments" element={<AllAppointments />} />
          <Route path="admin/add-doctor" element={<AddDoctor />} />
          <Route path="admin/doctor-list" element={<DoctorsList />} />
           <Route path="/admin/test-app" element={<TestAppointments />} />


          {/*  Doctor routes*/}
          <Route path="/doctor-dashboard" element={<DoctorDashBoard />} />
          <Route path="/doctor-appointments" element={<DoctorAppointments />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

          

        </Routes>
      </div>
    </div>
  ): (
    <>
      <Login />
      <ToastContainer/>
    </>
  )

}

export default App;

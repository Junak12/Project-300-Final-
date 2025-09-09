import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Doctors from './Pages/Doctors'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import MyAppointments from './Pages/MyAppointments'
import MyProfile from './Pages/MyProfile'
import Appointments from './Pages/Appointments'
import Navbar from './Components/Navbar'
import Test from './Pages/Test'
import Mytest from './Pages/Mytest'
import Pharmacy from './Pages/Pharmacy'
import AppointmentMain from './Pages/AppointmentMain'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <div className='mx-4 sm:mx-[10%]'>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<MyProfile />} />
          <Route path='/myAppointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointments />}/>
          <Route path='/main-app' element={<AppointmentMain />} />
          <Route path='/test' element={<Test />} />
          <Route path='/my-test' element={<Mytest />} />
          <Route path='/pharmacy' element={<Pharmacy />} />

          
        </Routes>
        <Footer />
      </div>
    </>
  )
}

export default App;

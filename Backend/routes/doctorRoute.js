import express from 'express';
import { doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, updateDoctorProfile,doctorProfile } from '../controllers/doctorController.js'; // ✅ FIXED: added .js extension
import authDoctor from '../middleware/authDoctor';

const doctorrouter = express.Router();

// Route: GET /api/doctor/list
doctorrouter.get('/list', doctorList);
doctorrouter.post('/login',loginDoctor);
doctorrouter.get('/appointments', authDoctor, appointmentsDoctor);
doctorrouter.post('/complete-appointment',authDoctor, appointmentComplete);
doctorrouter.post('/cancel-appointment', authDoctor, appointmentCancel);
doctorrouter.get('/dashboard', authDoctor, doctorDashboard);
doctorrouter.get('/profile',authDoctor, doctorProfile);
doctorrouter.post('/update-profile',authDoctor, updateDoctorProfile);

export default doctorrouter;

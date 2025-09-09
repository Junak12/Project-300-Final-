import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import authAdmin from './middleware/authAdmin.js';
import userRouter from './routes/userRoute.js';
import testRoutes from './routes/testRoutes.js';
import testAppointmentRoutes from './routes/testAppointmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminTestAppointmentRoutes from "./routes/adminTestAppointmentRoutes.js";



// app config
const app = express();
const PORT = process.env.PORT || 3000;
connectDB()
connectCloudinary();

// middleware
app.use(cors());
app.use(express.json());

//api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor',doctorRouter);
app.use('/api/user',userRouter)
app.use('/api', testRoutes);
app.use('/api/test-appointments', testAppointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/admin", adminTestAppointmentRoutes);


//localhost:3000/api/admin/add-doctor

app.get('/', (req, res) => {
  res.send('Welcome to the Backend Server! Hello');
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
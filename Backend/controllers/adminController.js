import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// API for Doctor adding
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imagefile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {  
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Optional: check if email already exists
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (!imagefile) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const imageUpload = await cloudinary.uploader.upload(imagefile.path, {
            resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        res.status(201).json({ success: true, message: "Doctor added successfully", doctor: newDoctor });

    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, message: "Login successful", token });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }

    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// api for all docotors

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.status(200).json({ success: true, doctors });
    } catch (error) {
        console.error("Error in allDoctors:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}  

//api to get all appointments list

const appointmentsAdmin = async(req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.status(200).json({ success: true, appointment: appointments });
    } catch (error) {
        console.error("Error in allDoctors:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

//api for appointment cancellation

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }


    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    res.json({ success: true, message: 'Appointment canceled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get Dashboard Data for admin pannel

const adminDashboard = async(req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData  = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments : appointments.reverse().slice(0,5),
        }

        res.json({success:true, dashData});

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });  
    }
}




export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };

import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

import Stripe from 'stripe';

// Initialize Stripe with your secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Please provide all required fields" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.json({ success: false, message: "Password must be at least 6 characters long" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({ success: true, message: "User registered successfully", token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data is missing for update" });
    }

    let parsedAddress;
    try {
      parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
    } catch {
      parsedAddress = address;
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }

    res.json({ success: true, message: "Profile updated Successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Book Appointment
const bookAppointment = async (req, res) => {
  try {
    const { docId, slotDate, slotTime } = req.body;
    const userId = req.user.userId;

    if (!docId || !slotDate || !slotTime) {
      return res.json({ success: false, message: 'Missing appointment details' });
    }

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' });
    }

    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor is not available' });
    }

    let slots_booked = docData.slots_booked || {};
    if (!slots_booked[slotDate]) {
      slots_booked[slotDate] = [];
    }
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: 'Slot already booked' });
    }

    slots_booked[slotDate].push(slotTime);

    const userData = await userModel.findById(userId).select('-password');

    const appointmentData = {
      userId,
      docId,
      userData: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image:userData.image,
        dob : userData.dob
      },
      docData: {
        name: docData.name,
        image: docData.image,
        speciality: docData.speciality,
        degree: docData.degree,
        experience: docData.experience,
        about: docData.about,
        fees: docData.fees,
        address: docData.address,
        available: docData.available,
      },
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List Appointments
const listAppointment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.userId;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointmentData.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized Action' });
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

// Payment via Stripe
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    console.log('paymentStripe called with appointmentId:', appointmentId);

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    const amountInCents = Math.round(appointmentData.amount * 100);
    console.log('Amount to charge (in cents):', amountInCents);

    if (amountInCents < 50) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least 50 cents to process payment',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: process.env.CURRENCY || 'usd',
      metadata: { appointmentId },
    });
    console.log('Created PaymentIntent:', paymentIntent.id);

    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required' });
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { $set: { payment: true } },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({
      success: true,
      message: 'Payment confirmed and database updated',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Database update failed' });
  }
};





export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  confirmPayment
};

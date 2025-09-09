import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
    try {

        const {docId} = req.body;
        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId, {available : !docData.available} )
        res.json({success : true, message: "Doctor availability changed successfully"});
        
    } catch (error) {

        console.log(error);
        res.json({success: false, message: error.message});
        
        
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({success: true, doctors});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


//api for doctor login

const loginDoctor = async(req, res) => {
    try {

        const {email, password} = req.body;
        const doctor = await doctorModel.findOne({email});

        if (!doctor) {
            return res.json({success:false, message:'Invalid Details'});
        }
        const isMatch = await bcrypt.compare(password, doctor.password);

        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
            res.json({success:true, token});
        }
        else {
            return res.json({success:false, message:'Invalid Details'});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

//api to get doctorAppointments for doctor pannel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.doctor.docId; 
    if (!docId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No doctor ID' });
    }

    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

  // api to mark appointment complete for doctor pannel
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.doctor.docId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
      return res.json({ success: true, message: 'Appointment Completed' });
    } else {
      return res.json({ success: false, message: 'Unauthorized or appointment not found' });
    }
  } catch (error) {
    console.error('appointmentComplete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  // api to cancel appointment complete for doctor panne
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.doctor.docId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
      return res.json({ success: true, message: 'Appointment Cancelled' });
    } else {
      return res.json({ success: false, message: 'Unauthorized or appointment not found' });
    }
  } catch (error) {
    console.error('appointmentCancel error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get dashBoard data for doctor pannel
const doctorDashboard = async(req, res) => {
    try {

        const {docId} = req.doctor;
        const appointments = await appointmentModel.find({docId});

        let earnings = 0;
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }
        })

        let patients = [];
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients : patients.length,
            latestAppointments:appointments.reverse().slice(0, 5),
        }
        res.json({success:true, dashData});
        
        
    } catch (error) {
        console.error('appointmentCancel error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//api to get Doctorm profile

const doctorProfile = async(req, res) => {
    try {

        const {docId} = req.doctor;
        const profileData = await doctorModel.findById(docId).select('-password');
        res.json({success:true,profileData});
        
    } catch (error) {
        console.error('appointmentCancel error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//update doctor data from doctor pannel

const updateDoctorProfile = async(req, res) => {
  try {
    const docId = req.doctor.docId; // from authDoctor middleware
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('updateDoctorProfile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}



export {changeAvailability,
     doctorList, 
     loginDoctor, 
     appointmentsDoctor, 
     appointmentComplete, 
     appointmentCancel, 
     doctorDashboard, 
     doctorProfile, 
     updateDoctorProfile  
};
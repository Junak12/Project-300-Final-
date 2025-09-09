import mongoose from 'mongoose';

const testAppointmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Make sure your User model is named 'User'
    required: true 
  },

  testName: { 
    type: String, 
    required: true 
  },

  fee: { 
    type: Number, 
    required: true 
  },

  testDate: { 
    type: Date, 
    required: true 
  },

  timeSlot: { 
    type: String, 
    required: true 
  },

  // Patient details
  patientName: { 
    type: String, 
    required: true 
  },

  patientAge: { 
    type: Number, 
    required: true 
  },

  patientGender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // enforce valid gender values
    required: true,
  },

  paymentIntentId: { 
    type: String 
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending',
  },

  notes: { 
    type: String 
  },

  cancelled: { 
    type: Boolean, 
    default: false 
  },

  isCompleted: { 
    type: Boolean, 
    default: false 
  },

}, { 
  timestamps: true 
});

// Model registration with PascalCase name matching the ref
const TestAppointment = mongoose.models.TestAppointment || mongoose.model('TestAppointment', testAppointmentSchema);

export default TestAppointment;

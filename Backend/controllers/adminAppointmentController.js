import AppointmentModel from "../models/appointmentModel.js";
import UserModel from "../models/userModel.js";

// Update patient details & appointment info by admin
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { patientName, patientAge, patientPicture, fees, paymentStatus, cancelled, isCompleted } = req.body;

    // Find the appointment
    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update patient info inside appointment (assuming you store patient data in appointment)
    if (patientName) appointment.patientName = patientName;
    if (patientAge) appointment.patientAge = patientAge;
    if (patientPicture) appointment.patientPicture = patientPicture;

    // Update fees if provided
    if (fees !== undefined) appointment.fees = fees;

    // Update status flags
    if (paymentStatus) appointment.paymentStatus = paymentStatus; // e.g. 'pending', 'succeeded'
    if (cancelled !== undefined) appointment.cancelled = cancelled;
    if (isCompleted !== undefined) appointment.isCompleted = isCompleted;

    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment updated successfully", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: "Server error while updating appointment" });
  }
};

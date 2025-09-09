import TestAppointment from "../models/TestAppointment.js";

// Get all test appointments
export const getAllTestAppointments = async (req, res) => {
  try {
    const testAppointments = await TestAppointment.find()
      .populate("userId", "name image dob") // populate user details (name, image, dob)
      .sort({ createdAt: -1 });

    if (!testAppointments.length) {
      return res.status(404).json({ success: false, message: "No test appointments found" });
    }

    // Map to include patientAge from stored patientAge or calculate if needed
    const data = testAppointments.map((app) => ({
      _id: app._id,
      testName: app.testName,
      fee: app.fee,
      testDate: app.testDate,
      timeSlot: app.timeSlot,
      patientName: app.patientName,
      patientAge: app.patientAge,
      patientGender: app.patientGender,
      paymentStatus: app.paymentStatus,
      userData: app.userId, // populated user data
      createdAt: app.createdAt,
    }));

    res.json({ success: true, testAppointments: data });
  } catch (error) {
    console.error("Error in getAllTestAppointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update a test appointment (for example: update patientName, fee, paymentStatus, etc.)
export const updateTestAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // expect fields to update in body

    const updatedAppointment = await TestAppointment.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: "Test appointment not found" });
    }

    res.json({ success: true, message: "Test appointment updated", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error in updateTestAppointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel test appointment (optional, for setting status or deleting)
export const cancelTestAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Option 1: Set a flag to cancelled
    const cancelled = await TestAppointment.findByIdAndUpdate(id, { paymentStatus: "cancelled" }, { new: true });

    if (!cancelled) {
      return res.status(404).json({ success: false, message: "Test appointment not found" });
    }

    res.json({ success: true, message: "Test appointment cancelled", appointment: cancelled });
  } catch (error) {
    console.error("Error in cancelTestAppointment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  getAllTestAppointments,
  updateTestAppointment,
  cancelTestAppointment,
} from "../controllers/adminTestAppointmentController.js";

const router = express.Router();

router.get("/test-appointments", authAdmin, getAllTestAppointments);
router.put("/test-appointments/update/:id", authAdmin, updateTestAppointment);
router.post("/test-appointments/cancel/:id", authAdmin, cancelTestAppointment);

export default router;

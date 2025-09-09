import express from "express";
import { getAllAppointments, appointmentCancel, updateAppointment } from "../controllers/adminAppointmentController.js";
import { authAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/appointments", authAdmin, getAllAppointments);
router.post("/appointments/cancel/:id", authAdmin, appointmentCancel);
router.put("/appointments/update/:appointmentId", authAdmin, updateAppointment);

export default router;

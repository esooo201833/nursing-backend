// back-end/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    status: { 
      type: String, 
      enum: ["pending", "assigned", "in-progress", "completed", "cancelled"], 
      default: "pending" 
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    
    // ✅ جديد: تقرير الـ Doctor/Nurse
    report: {
      visited: { type: Boolean, default: false },
      visitDate: { type: Date },
      notes: { type: String, default: "" },
      patientCondition: { type: String, default: "" },
      medications: { type: String, default: "" },
      nextVisitRequired: { type: Boolean, default: false },
      nextVisitDate: { type: Date }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
// back-end/models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    duration: { type: String, default: "1 hour" }, // مدة الخدمة
    category: { 
      type: String, 
      enum: ["nursing", "medical", "therapy", "equipment", "other"],
      default: "nursing"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
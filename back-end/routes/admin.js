// back-end/routes/admin.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Service = require("../models/Service");

// Middleware: Check if Admin
const isAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.body;
    
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied! Admins only ❌" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

// ==========================================
// 👥 إدارة الـ Users (Doctors & Nurses)
// ==========================================

// ➕ إضافة Doctor/Nurse جديد
router.post("/create-user", async (req, res) => {
  try {
    const { adminId, name, email, role, phone } = req.body;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists ❌" });
    }

    // Generate random password
    const generatedPassword = Math.random().toString(36).slice(-8);

    const newUser = new User({
      name,
      email,
      password: generatedPassword,
      role, // "doctor" or "nurse"
      phone: phone || ""
    });

    await newUser.save();

    res.status(201).json({
      message: `${role} created successfully ✅`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        generatedPassword
      }
    });

  } catch (error) {
    console.error("❌ Create user error:", error);
    res.status(500).json({ message: "Server error ❌", error: error.message });
  }
});

// 🗑️ حذف User
router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const { adminId } = req.body;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    res.json({ message: `${user.name} deleted successfully ✅` });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب كل Doctors & Nurses
router.get("/staff", async (req, res) => {
  try {
    const staff = await User.find({ 
      role: { $in: ['doctor', 'nurse'] }  // ✅ غيّرنا من 'user' لـ 'nurse'
    }).select('-password');
    
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ==========================================
// 🏥 إدارة الخدمات (Services)
// ==========================================

// ➕ إضافة Service جديد
router.post("/create-service", async (req, res) => {
  try {
    const { adminId, name, description, price, duration, category } = req.body;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    // Check if service exists
    const serviceExists = await Service.findOne({ name });
    if (serviceExists) {
      return res.status(400).json({ message: "Service already exists ❌" });
    }

    const newService = new Service({
      name,
      description,
      price: price || 0,
      duration: duration || "1 hour",
      category: category || "nursing"
    });

    await newService.save();

    res.status(201).json({
      message: "Service created successfully ✅",
      service: newService
    });

  } catch (error) {
    console.error("❌ Create service error:", error);
    res.status(500).json({ message: "Server error ❌", error: error.message });
  }
});

// ✏️ تعديل Service
router.put("/update-service/:serviceId", async (req, res) => {
  try {
    const { adminId, name, description, price, duration, isActive } = req.body;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.serviceId,
      { name, description, price, duration, isActive },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found ❌" });
    }

    res.json({
      message: "Service updated successfully ✅",
      service: updatedService
    });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 🗑️ حذف Service
router.delete("/delete-service/:serviceId", async (req, res) => {
  try {
    const { adminId } = req.body;

    // Check if admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Access denied ❌" });
    }

    const service = await Service.findByIdAndDelete(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found ❌" });
    }

    res.json({ message: `${service.name} deleted successfully ✅` });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب كل Services
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب Services النشطة بس (للـ Users)
router.get("/services/active", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
// back-end/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// تسجيل يوزر جديد
router.post("/register", async (req, res) => {
  console.log("🔥 REGISTER HIT");
  console.log("📦 REQUEST BODY:", req.body);
  
  try {
    const { name, email, password, role } = req.body;

    // ✅ تأكد إن كل الحقول موجودة
    if (!name || !email || !password) {
      console.log("❌ Missing fields!");
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const user = new User({ name, email, password, role: role || "user" });
    
    console.log("💾 Saving user...");
    const savedUser = await user.save();
    console.log("✅ SAVED USER:", savedUser);

    console.log("🗄️  Database:", User.db.name);
    console.log("📂 Collection:", User.collection.name);

    res.status(201).json({ 
      message: "User registered successfully ✅", 
      user: savedUser 
    });
    
  } catch (error) {
    console.error("❌ REGISTER ERROR:", error.message);
    res.status(500).json({ message: "Server error ❌", error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("🔥 LOGIN HIT");
  console.log("📦 Body:", req.body);

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (user.password !== password) {
      console.log("❌ Wrong password");
      return res.status(400).json({ message: "Wrong password ❌" });
    }

    console.log("✅ Login success:", user.name);
    res.json({ 
      message: "Login successful ✅", 
      user: { 
        _id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ➕ جيب كل الـ Users (Doctors & Nurses) - للـ Admin
router.get("/all-users", async (req, res) => {
  console.log("🔥 GET ALL USERS HIT");
  
  try {
    const users = await User.find({ 
      role: { $in: ['doctor', 'nurse'] }  // ✅ غيّرنا من 'user' لـ 'nurse'
    }).select('-password');
    
    console.log("👥 Found users:", users.length);
    res.json(users);
    
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
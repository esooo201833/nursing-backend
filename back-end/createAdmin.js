// back-end/createAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // اتصل بالداتا بيز
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // شوف لو الـ Admin موجود
    const adminExists = await User.findOne({ email: "eslammohamed201933@gmail.com" });
    
    if (adminExists) {
      console.log("⚠️ Admin already exists:", adminExists);
      
      // عدل الباسورد لو عايز
      adminExists.password = "Moh@01102";
      await adminExists.save();
      console.log("✅ Admin password updated!");
      
    } else {
      // اعمل Admin جديد
      const admin = new User({
        name: "Eslam Mohamed",
        email: "eslammohamed201933@gmail.com",
        password: "Moh@01102",
        role: "admin"
      });
      
      await admin.save();
      console.log("✅ Admin created successfully!");
      console.log(admin);
    }

    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();
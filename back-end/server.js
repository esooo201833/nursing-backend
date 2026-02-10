// ======== استدعاء المكتبات ========
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// ======== Models ========
const User = require("./models/User");

// ======== Routes ========
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

// ======== إنشاء السيرفر ========
const app = express();

// ======== Middleware ========
app.use(cors());
app.use(express.json());

// ======== Static Files ========
const publicPath = path.join(__dirname, "../public");
console.log("📁 Serving files from:", publicPath);

app.use(express.static(publicPath));

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ======== Logging ========
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} request to ${req.url}`);
  next();
});

// ======== MongoDB Atlas Connection ========
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected!");
    console.log("🗄️  Database:", mongoose.connection.name);
    createAdmin();
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ======== إنشاء Admin أول مرة ========
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "eslammohamed201933@gmail.com",
    });

    if (!adminExists) {
      await User.create({
        name: "Eslam Mohamed",
        email: "eslammohamed201933@gmail.com",
        password: "Moh@01102",
        role: "admin",
      });
      console.log("✅ Admin created successfully!");
    } else {
      console.log("⚠️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
  }
};

// ======== Routes ========
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ======== Test Route ========
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ======== تشغيل السيرفر ========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/index.html`);
});

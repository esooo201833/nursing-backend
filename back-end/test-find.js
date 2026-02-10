const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();
const connectDB = require("./config/db");

connectDB();

mongoose.connection.once("open", async () => {
  console.log("MongoDB Connected ✅");

  const users = await User.find();
  console.log("ALL USERS:", users);

  process.exit(); // عشان يقفل السكربت بعد الطباعة
});

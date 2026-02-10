// back-end/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "nursing_db"
    });
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB connection ERROR ❌:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

// back-end/routes/bookings.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ➕ عمل حجز جديد
router.post("/", async (req, res) => {
  console.log("🔥 BOOKING POST HIT");
  console.log("📦 Body:", req.body);

  try {
    const { userId, patientName, service, date, time, address, phone, notes } = req.body;

    // ✅ تأكد إن كل الحقول موجودة
    if (!userId || !patientName || !service || !date || !time || !address || !phone) {
      console.log("❌ Missing fields!");
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    const booking = new Booking({
      user: userId,
      patientName,
      service,
      date,
      time,
      address,
      phone,
      notes: notes || ""
    });

    const savedBooking = await booking.save();
    console.log("✅ Booking saved:", savedBooking);

    res.status(201).json({ 
      message: "Booking created successfully ✅", 
      booking: savedBooking 
    });

  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({ message: "Server error ❌", error: error.message });
  }
});

// 📋 جيب كل الحجوزات
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب حجوزات User معين
router.get("/my-bookings/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 👤 جيب الحجوزات المخصصة لـ Doctor/Nurse
router.get("/assigned/:doctorId", async (req, res) => {
  try {
    const bookings = await Booking.find({ assignedTo: req.params.doctorId })
      .populate("user", "name email phone")
      .sort({ date: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✏️ توزيع الحجز على Doctor/Nurse (Admin)
router.put("/assign/:bookingId", async (req, res) => {
  console.log("🔥 ASSIGN HIT");
  console.log("📦 Body:", req.body);
  
  try {
    const { doctorId, adminId } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { 
        assignedTo: doctorId, 
        assignedBy: adminId,
        status: "assigned"
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }

    console.log("✅ Assigned:", booking);
    res.json({ message: "Booking assigned successfully ✅", booking });
    
  } catch (error) {
    console.error("❌ Assign error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✏️ تحديث حالة الحجز (Doctor/Nurse)
router.put("/status/:bookingId", async (req, res) => {
  console.log("🔥 STATUS UPDATE HIT");
  console.log("📦 Body:", req.body);
  
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }

    console.log("✅ Status updated:", booking);
    res.json({ message: "Status updated successfully ✅", booking });
    
  } catch (error) {
    console.error("❌ Status update error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب الحجوزات المخصصة لـ Staff (Doctor/Nurse) - NEW
router.get("/my-orders/:staffId", async (req, res) => {
  console.log("🔥 MY ORDERS HIT:", req.params.staffId);
  
  try {
    const bookings = await Booking.find({ assignedTo: req.params.staffId })
      .populate("user", "name email phone")
      .sort({ date: 1 });
    
    console.log("📥 Found orders:", bookings.length);
    res.json(bookings);
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ✏️ تحديث حالة الحجز + إضافة تقرير (Doctor/Nurse) - NEW
router.put("/update-order/:bookingId", async (req, res) => {
  console.log("🔥 UPDATE ORDER HIT");
  console.log("📦 Body:", req.body);
  
  try {
    const { status, report, staffId } = req.body;
    
    // ✅ تأكد إن الـ Staff هو اللي معاه الـ Booking
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      assignedTo: staffId
    });
    
    if (!booking) {
      return res.status(403).json({ message: "Not authorized or booking not found ❌" });
    }

    const updateData = { status };
    
    // ✅ لو فيه تقرير، ضيفه
    if (report) {
      updateData.report = {
        visited: report.visited || true,
        visitDate: report.visitDate || new Date(),
        notes: report.notes || "",
        patientCondition: report.patientCondition || "",
        medications: report.medications || "",
        nextVisitRequired: report.nextVisitRequired || false,
        nextVisitDate: report.nextVisitDate || null
      };
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      updateData,
      { new: true }
    );

    console.log("✅ Updated:", updatedBooking);
    res.json({ 
      message: "Order updated successfully ✅", 
      booking: updatedBooking 
    });
    
  } catch (error) {
    console.error("❌ Update error:", error);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// 📋 جيب تفاصيل حجز معين (مع التقرير) - NEW
router.get("/details/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user", "name email phone")
      .populate("assignedTo", "name role");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }
    
    res.json(booking);
    
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;
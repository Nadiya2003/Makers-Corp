require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const inquiryRoutes = require("./routes/inquiryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const commercialVehicleRoutes = require("./routes/commercialVehicleRoutes");
const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const mapResolveRoute = require("./routes/mapResolveRoute");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/public", express.static("public"));

// Normalize http://makersceylon.com image URLs to https://makersceylon.com in all API responses
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    if (data && typeof data === 'object') {
      try {
        const str = JSON.stringify(data);
        if (str.includes('http://makersceylon.com') || str.includes('http://www.makersceylon.com')) {
          const replaced = str
            .replace(/http:\/\/makersceylon\.com/g, 'https://makersceylon.com')
            .replace(/http:\/\/www\.makersceylon\.com/g, 'https://www.makersceylon.com');
          return originalJson.call(this, JSON.parse(replaced));
        }
      } catch (e) {}
    }
    return originalJson.call(this, data);
  };
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/commercial-vehicles", commercialVehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/map-resolve", mapResolveRoute);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Ceylon Imports API is running" });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://markersCeylon:markersCeylon43234Dfdsdf@main-cluster.vqngjf9.mongodb.net/markersCeylon";

// Start server immediately so API is responsive
app.listen(PORT, () => {
  console.log(`🚀  Makers Corp Japan Backend running on http://localhost:${PORT}`);
});

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectWithRetry(attempt = 1) {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✅  MongoDB connected successfully");
  } catch (err) {
    console.error(
      `❌  MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`,
    );
    if (
      err.message.includes("ETIMEDOUT") ||
      err.message.includes("ECONNREFUSED")
    ) {
      console.error(
        "💡  Fix: Go to MongoDB Atlas → Security → Network Access → Add your current IP or allow 0.0.0.0/0",
      );
      console.error(
        "💡  Also check: Is the Atlas cluster paused? (Free tier auto-pauses after inactivity)",
      );
    }
    if (attempt < MAX_RETRIES) {
      console.log(`⏳  Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      setTimeout(() => connectWithRetry(attempt + 1), RETRY_DELAY_MS);
    } else {
      console.warn("⚠️  Max retries reached. Backend running with offline database fallback.");
    }
  }
}

connectWithRetry();

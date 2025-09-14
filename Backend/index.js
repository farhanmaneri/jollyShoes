// Load environment variables early
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const session = require("express-session");
const passport = require("./config/passport.js");
require("./config/passport");
const AdminRoutes = require("./routes/AdminRoutes");
const AuthRoutes = require("./routes/Auth"); // 👈 This import is correct

// Create express app
const app = express();
const port = process.env.PORT || 5000; // Use only this declaration
// ✅ Pick allowed origins dynamically
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        process.env.FRONTEND_URL_PROD,
        process.env.FRONTEND_URL_PREVIEW, // optional extra production URL
      ].filter(Boolean) // removes undefined if not set
    : [process.env.FRONTEND_URL_DEV];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server requests with no origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Error: Not allowed by CORS - " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// console.log("✅ Allowed Origins:", allowedOrigins);

// ✅ Handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware
app.use(morgan("tiny"));
app.use(express.json()); // 👈 ENSURE THIS IS BEFORE ROUTES
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Debug origin logging
app.use((req, res, next) => {
  // // console.log("🟢 Incoming request from origin:", req.headers.origin);
  next();
});

// ✅ Connect to MongoDB
const dbConnection = async () => {
  try {
    const connectionURI = process.env.MONGODB_CONNECTION_URI;
    // // console.log("🔗 MongoDB Connection URI:", connectionURI);
    if (!connectionURI) {
      // console.error("❌ MONGODB_CONNECTION_URI is missing in .env");
      return;
    }

    await mongoose.connect(connectionURI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

dbConnection();

// ✅ Add root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Jolly Shoes Backend API" });
});

// ✅ Test Route
app.get("/test", (req, res) => {
  res.json({ message: "✅ Server is running successfully!" });
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());

// 👈 FIXED: MOUNT ROUTES HERE (AFTER MIDDLEWARE, BEFORE ERROR HANDLER)

// Add this right after mounting your routes in index.js
// Add this RIGHT BEFORE your route mounting in server file

// Debug middleware to catch all requests
app.use((req, res, next) => {
  // console.log(`🔍 Incoming: ${req.method} ${req.originalUrl}`);
  next();
});

// Mount routes (ONLY ONCE)
app.use("/admin", AdminRoutes);
app.use("/auth", AuthRoutes);

// Add specific debug for place-order
app.use('/auth/place-order', (req, res, next) => {
  // console.log('🎯 Intercepted /auth/place-order request');
  // console.log('Method:', req.method);
  // console.log('Headers:', req.headers);
  // console.log('Body:', req.body);
  next();
});

// Catch-all for 404s (add this at the very end, after all routes)
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});


// Add this debug middleware IMMEDIATELY after mounting auth routes


// Add catch-all debug for auth routes

  // Check if the route exists in AuthRoutes
 
//  Needed for Passport

app.use((err, req, res, next) => {
  // console.error("❌ Server Error:", err.message);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ✅ Only start server if not running on Vercel
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000; // 👈 Changed to 5000 to match your logs
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}

module.exports = app; // needed for Vercel

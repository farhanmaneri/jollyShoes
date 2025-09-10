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
const AuthRoutes = require("./routes/Auth");

// Create express app
const app = express();
const port = process.env.PORT || 3000;



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

// ... your routes here
// testing

// ✅ Handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware
app.use(morgan("tiny"));
app.use(express.json());
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
// this commit is just for vercel update
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
// ✅ Routes
app.use("/admin", AdminRoutes);
app.use("/auth", AuthRoutes);

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
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}
// ✅ Debug: Check if routes file exists and loads
// // console.log("🔍 Checking routes...");

// try {
//   const AuthRoutes = require("./routes/Auth");
//   // console.log("✅ Auth routes loaded successfully");
//   // console.log("🔍 Auth routes type:", typeof AuthRoutes);
  
//   // List all registered routes
//   if (AuthRoutes && AuthRoutes.stack) {
//     // console.log("📋 Registered routes in AuthRoutes:");
//     AuthRoutes.stack.forEach(layer => {
//       if (layer.route) {
//         const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
//         // console.log(`  ${methods} ${layer.route.path}`);
//       }
//     });
//   }
// } catch (error) {
//   // console.error("❌ Error loading Auth routes:", error.message);
//   // console.error("❌ Full error:", error);
// }

// // ✅ Debug: List all registered routes on the app
// // console.log("📋 All registered app routes:");
// app._router.stack.forEach((middleware, index) => {
//   if (middleware.route) {
//     // Direct route
//     const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
//     // console.log(`  ${methods} ${middleware.route.path}`);
//   } else if (middleware.name === 'router') {
//     // Router middleware
//     // console.log(`  Router: ${middleware.regexp.source}`);
//     if (middleware.handle && middleware.handle.stack) {
//       middleware.handle.stack.forEach(layer => {
//         if (layer.route) {
//           const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
//           // console.log(`    ${methods} ${layer.route.path}`);
//         }
//       });
//     }
//   }
// });

// // ✅ Test route to verify app is working
// app.get("/debug-test", (req, res) => {
//   res.json({ 
//     message: "Debug route working",
//     timestamp: new Date().toISOString()
//   });
// });

// // console.log("🔗 Test debug route: http://localhost:3000/debug-test");

module.exports = app; // needed for Vercel


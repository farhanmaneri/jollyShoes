const express = require("express");
const passport = require("passport");

// Import your controllers
const {
  createUser,
  userAuthentication,
  changePassword,
  VerifyEmail,
  getUserProfile,
  findOrCreateOAuthUser,
} = require("../controllers/user");
const {
  resetPassword,
  requestPasswordReset,
} = require("../controllers/authController");
const {
  getProducts,
  getProduct,
  deleteProduct,
  editProduct,
} = require("../controllers/products");
const { getGoldRate } = require("../controllers/goldRate");

const sendOtp = require("../controllers/otpController");
// Add this to your auth routes file right after the placeOrder import

let placeOrder;
try {
  placeOrder = require("../controllers/placeOrder");
  console.log("✅ placeOrder controller loaded successfully");
  console.log("✅ placeOrder type:", typeof placeOrder); // Should be "function"
  console.log("✅ placeOrder function name:", placeOrder.name); // Should show function name
} catch (error) {
  console.error("❌ Error loading placeOrder controller:", error.message);
}

// Make sure your placeOrder controller exports like this:
// module.exports = placeOrder;  // NOT { placeOrder }

// Test the route with explicit function check

  


const AuthRoutes = express.Router();

// console.log("✅ Auth Routes file loaded");

// ✅ Test route to verify routes are working
AuthRoutes.get("/test", (req, res) => {
  res.json({ message: "✅ Auth routes are working!" });
});

// ✅ Test Google route path
AuthRoutes.get("/google-test", (req, res) => {
  res.json({ message: "✅ Google route path is accessible" });
});

// Product routes
AuthRoutes.get("/product/:id", getProduct);
AuthRoutes.get("/products", getProducts);
AuthRoutes.get("/profile/me", getUserProfile);
AuthRoutes.delete("/:id", deleteProduct); // 👈 Note: This might conflict—consider /admin/delete/:id
AuthRoutes.put("/product/:id", editProduct);

// Auth + User routes
AuthRoutes.post("/request-reset", requestPasswordReset);
AuthRoutes.post("/reset-password/:token", resetPassword);
AuthRoutes.post("/signup", createUser);
AuthRoutes.post("/login", userAuthentication);
AuthRoutes.post("/change-password", changePassword);
AuthRoutes.post("/verify-otp", VerifyEmail);
AuthRoutes.post("/send-otp", sendOtp);

// 👈 FIXED: Ensure this is after imports and before OAuth routes
AuthRoutes.post("/place-order", placeOrder); // 👈 This should now log "placeOrder controller loaded successfully"
console.log("✅ /place-order route registered"); // 👈 Debug log
// Add this simple test route to your auth routes file, right after your existing place-order route

// Simple test route that doesn't depend on the controller


// Also add a GET version to test if it's a method issue
AuthRoutes.get("/place-order-test", (req, res) => {
  res.json({
    success: true,
    message: "GET test route working!",
    method: "GET"
  });
});
AuthRoutes.post("/place-order-test", (req, res) => {
  console.log("🎯 Test place order route hit successfully!");
  console.log("Request body:", req.body);
  res.json({
    success: true,
    message: "Test route working!",
    receivedData: req.body,
  });
});
AuthRoutes.get("/gold-rate", getGoldRate);

// ✅ Google OAuth Routes with better error handling
AuthRoutes.get("/google", (req, res, next) => {
  const redirectUrl = req.query.redirectUrl || "/";

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirectUrl, // 👈 pass redirectUrl via OAuth "state"
  })(req, res, next);
});

AuthRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const { user, token } = await findOrCreateOAuthUser(req.user, "google");

      const frontendURL =
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL_PROD
          : "http://localhost:5173";

      // 👇 pull original redirectUrl from state
      let redirectUrl = req.query.state || "/";
      if (redirectUrl.startsWith("http")) {
        try {
          redirectUrl = new URL(redirectUrl).pathname;
        } catch {
          redirectUrl = "/";
        }
      }

      const userData = encodeURIComponent(
        JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token,
          id: user._id,
        })
      );

      res.redirect(
        `${frontendURL}/oauth/callback?token=${token}&user=${userData}&redirectUrl=${redirectUrl}`
      );
    } catch (error) {
      const frontendURL =
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL_PROD
          : "http://localhost:5173";
      res.redirect(`${frontendURL}/oauth/callback?error=auth_failed`);
    }
  }
);

// ✅ Facebook OAuth Routes - simplified
AuthRoutes.get("/facebook", (req, res, next) => {
  // console.log("🟢 Facebook OAuth route hit");
  passport.authenticate("facebook", {
    scope: ["email"],
  })(req, res, next);
});

AuthRoutes.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  async (req, res) => {
    try {
      const { user, token } = await findOrCreateOAuthUser(req.user, "facebook");

      const frontendURL =
        process.env.NODE_ENV === "production"
          ? process.env.VITE_FRONTEND_PROD
          : "http://localhost:5173";

      const userData = encodeURIComponent(
        JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token,
          id: user._id,
        })
      );

      res.redirect(
        `${frontendURL}/oauth/callback?token=${token}&user=${userData}`
      );
    } catch (error) {
      // console.error("❌ Facebook OAuth error:", error);
      const frontendURL =
        process.env.NODE_ENV === "production"
          ? process.env.VITE_FRONTEND_PROD
          : "http://localhost:5173";
      res.redirect(`${frontendURL}/oauth/callback?error=auth_failed`);
    }
  }
);

module.exports = AuthRoutes;

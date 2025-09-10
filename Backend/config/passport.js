const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Users = require("../models/user.js");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${process.env.VITE_API_PROD}/auth/google/callback`
          : `${process.env.VITE_API_DEV}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log(
        //   "🔍 Google Profile Raw Data:",
        //   JSON.stringify(profile, null, 2)
        // );

        // Extract user data with fallbacks
        const userData = {
          id: profile.id,
          displayName:
            profile.displayName ||
            profile.name?.givenName + " " + profile.name?.familyName ||
            "Google User",
          emails: profile.emails || [{ value: profile._json?.email }],
          photos: profile.photos || [{ value: profile._json?.picture }],
          _json: profile._json, // Keep raw data for debugging
        };

        // console.log("🔧 Processed Google User Data:", userData);

        return done(null, userData);
      } catch (err) {
        // console.error("❌ Google Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? `${process.env.VITE_API_PROD}/auth/facebook/callback`
          : `${process.env.VITE_API_DEV}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
         // console.log(
        //   "🔍 Facebook Profile Raw Data:",
        //   JSON.stringify(profile, null, 2)
        // );

        const userData = {
          id: profile.id,
          displayName: profile.displayName || "Facebook User",
          emails: profile.emails || [],
          photos: profile.photos || [],
        };

        // console.log("🔧 Processed Facebook User Data:", userData);

        return done(null, userData);
      } catch (err) {
        // console.error("❌ Facebook Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

// These are required even if you're not using sessions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

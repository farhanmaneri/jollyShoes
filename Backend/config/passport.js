const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// ✅ Use BACKEND URLs (not VITE frontend env vars)
const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_URL_PROD
    : process.env.BACKEND_URL_DEV;

// ---------------- Google Strategy ----------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          id: profile.id,
          displayName:
            profile.displayName ||
            `${profile.name?.givenName || ""} ${
              profile.name?.familyName || ""
            }`.trim() ||
            "Google User",
          emails: profile.emails || [{ value: profile._json?.email }],
          photos: profile.photos || [{ value: profile._json?.picture }],
          _json: profile._json,
        };

        return done(null, userData);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ---------------- Facebook Strategy ----------------
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${BACKEND_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          id: profile.id,
          displayName: profile.displayName || "Facebook User",
          emails: profile.emails || [],
          photos: profile.photos || [],
        };

        return done(null, userData);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// ---------------- Session Handling (even if you don’t use sessions) ----------------
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

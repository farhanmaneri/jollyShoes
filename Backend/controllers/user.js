const mongoose = require("mongoose");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail ,sendVerificationEamil} = require("../middlewares/Email");
const { generateToken } = require("../utils/jwt");

let getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).send({ data: users });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};

let createUser = async (req, res) => {
    // console.log("Signup request body:", req.body);

  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const ExistsUser = await Users.findOne({ email });
    if (ExistsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists Please Login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // // console.log(hashedPassword);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new Users({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    const response= await user.save();
    // generateTokenAndSetCookies(res, user._id);
      res.status(200).send({ data: response, message: "User is created successfully" });

    await sendVerificationEamil(user.email, verificationToken);
    
  } catch (error) {
    // console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "internal server error" });
  }
}
    const VerifyEmail=async(req,res)=>{
    try {
        const {otp}=req.body 
        const user= await Users.findOne({
            verificationToken:otp,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        if (!user) {
            return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
                
            }
          
     user.isVerified=true;
     user.verificationToken=undefined;
     user.verificationTokenExpiresAt=undefined;
     await user.save()
      res.status(200).json({success:true,message:"Email Verifed Successfully"})
     
      await sendWelcomeEmail(user.email,user.name)
           
    } catch (error) {
        // console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}
let userAuthentication = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    

    let compareHashResponse = await bcrypt.compare(password, user.password);
    if (compareHashResponse) {
      
      const token = jwt.sign(
        { id: user._id, role: user.role , name: user.name,     // 👈 include name
    email: user.email    },
        process.env.JWT_SECRET,
        { algorithm: "HS256", expiresIn: "7d" } // 7 days instead of 1 hour
      );
      return res
        .status(200)
        .send({
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
          },
        });
      // return res.status(200).send({ data: tempUser });
    } else {
      return res.status(401).send({ message: "Invalid Password" });
    }
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
let facebookAuthCallback = async (req, res) => {
  const URL =
    process.env.MODE === "production"
      ? process.env.FRONTEND_URL_PROD
      : process.env.FRONTEND_URL_DEV;
  try {
    // Passport attaches user profile to req.user
    const fbProfile = req.user;

    if (!fbProfile || !fbProfile.email) {
      return res.status(400).json({ error: "Facebook login failed" });
    }

    // Check if user already exists
    let user = await Users.findOne({ email: fbProfile.email });

    if (!user) {
      // Create new user
      user = new Users({
        name: fbProfile.name,
        email: fbProfile.email,
        facebookId: fbProfile.facebookId, // store fb id
        picture: fbProfile.picture,
        isVerified: true, // Facebook already verified their identity
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "7d" }
    );

    // Redirect to frontend with token
    res.redirect(
      `${URL}/dashboard?token=${token}&name=${encodeURIComponent(user.name)}`
    );
  } catch (error) {
    // console.error("Error in facebookAuthCallback:", error);
    res.status(500).json({ error: "Facebook login error" });
  }
};


let changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
// console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token not found" });
    }
    

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ error: "Token is expired" });
    }

    const _id = decodedToken.id;
    const ObjectId = mongoose.Types.ObjectId;

    // Validate if _id is a valid ObjectId
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Fetch user by email and _id
const user = await Users.findOne({
  email,
  _id: new ObjectId(_id),
}).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate if password fields exist
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Current password is required" });
    }
    if (!user.password || typeof user.password !== "string") {
      return res
        .status(500)
        .json({ error: "Stored password is missing or corrupted" });
    }

    // console.log("Entered Password:", password);
    // console.log("Stored Hashed Password:", user.password);

    // Compare entered password with hashed password
    let compareHashResponse = await bcrypt.compare(password, user.password);
    if (!compareHashResponse) {
      return res.status(401).json({ error: "Current password is invalid" });
    }

    // Hash and update the new password
    let computedHash = await bcrypt.hash(newPassword, 10);
    user.password = computedHash;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password is updated successfully" });
  } catch (error) {
    // console.error("Error in changePassword:", error);
    res.status(500).json({ error: error.toString() });
  }
};

let getUserProfile = async (req, res) => {
  try {
    // console.log("Headers received:", req.headers);
    // console.log("Authorization header:", req.headers.authorization);
    
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Extracted token:", token);
    
    if (!token) {
      // console.log("No token found in headers");
      return res.status(401).json({ error: "Unauthorized: Token not found" });
    }

    // console.log("JWT_SECRET available:", !!process.env.JWT_SECRET);
    
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded token:", decodedToken);
      
      if (!decodedToken) {
        return res.status(401).json({ error: "Token is expired" });
      }
    } catch (jwtError) {
      // console.log("JWT verification error:", jwtError.message);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    const _id = decodedToken.id;
    const ObjectId = mongoose.Types.ObjectId;

    // Validate if _id is a valid ObjectId
    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Fetch user by _id (excluding password)
    const user = await Users.findById(_id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    // // console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: error.toString() });
  }
};
const findOrCreateOAuthUser = async (profile, provider) => {
  try {
    let query = {};

    // Build query based on provider
    if (provider === "google") {
      query.googleId = profile.id;
    } else if (provider === "facebook") {
      query.facebookId = profile.id;
    }

    // Try to find existing user by provider ID first
    let user = await Users.findOne(query);

    if (!user) {
      // Extract email
      let email = null;
      if (profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value;
      } else if (profile._json && profile._json.email) {
        email = profile._json.email;
      }

      // 👇 NEW: Also check if user exists by email
      if (email) {
        user = await Users.findOne({ email: email });

        if (user) {
          // User exists with this email, update with OAuth provider ID
          if (provider === "google") {
            user.googleId = profile.id;
          } else if (provider === "facebook") {
            user.facebookId = profile.id;
          }
          user.lastLogin = new Date();
          await user.save();
          console.log(
            `✅ Existing user updated with ${provider} ID:`,
            user.email
          );
        }
      }
    }

    if (!user) {
      // Extract remaining profile data
      let email = null;
      if (profile.emails && profile.emails.length > 0) {
        email = profile.emails[0].value;
      } else if (profile._json && profile._json.email) {
        email = profile._json.email;
      }

      let name = profile.displayName;
      if (!name && profile._json) {
        name =
          profile._json.name ||
          `${profile._json.given_name || ""} ${
            profile._json.family_name || ""
          }`.trim();
      }
      if (!name) {
        name = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;
      }

      let avatar = null;
      if (profile.photos && profile.photos.length > 0) {
        avatar = profile.photos[0].value;
      } else if (profile._json && profile._json.picture) {
        avatar = profile._json.picture;
      }

      // Validate required fields
      if (!email) {
        throw new Error(`Email not provided by ${provider}`);
      }
      if (!name) {
        throw new Error(`Name not provided by ${provider}`);
      }

      // Create new user
      const userData = {
        name,
        email,
        avatar,
        role: "user",
        isVerified: true,
        provider,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      // Set provider-specific ID
      if (provider === "google") {
        userData.googleId = profile.id;
      } else if (provider === "facebook") {
        userData.facebookId = profile.id;
      }

      user = new Users(userData);
      await user.save();
      console.log(`✅ New ${provider} user created:`, user.email);
    } else {
      // Update existing user's last login
      user.lastLogin = new Date();
      await user.save();
      console.log(`✅ Existing user logged in:`, user.email);
    }

    const token = generateToken(user);
    return { user, token };
  } catch (error) {
    console.error("❌ OAuth user creation error:", error);
    throw new Error("OAuth user creation failed: " + error.message);
  }
};
let googleAuthCallback = async (req, res) => {
   const URL =
     process.env.NODE_ENV === "production"
       ? process.env.FRONTEND_URL_PROD
       : process.env.FRONTEND_URL_DEV;
  try {
    const { user, token } = await findOrCreateOAuthUser(req.user, "google");
    res.redirect(
      `${URL}/dashboard?token=${token}&user=${encodeURIComponent(user)}`
    );
  } catch (error) {
    // console.error("Error in googleAuthCallback:", error);
    res.status(500).json({ error: "Google login error" });
  }
};


module.exports = {
  createUser,
  getUsers,
  userAuthentication,
  facebookAuthCallback,
  findOrCreateOAuthUser,
  googleAuthCallback,
  changePassword,
  VerifyEmail,
  getUserProfile,
};

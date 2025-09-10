const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user contains { id, role }
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid token" });
  }
};


// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Access denied. Admins only!" });
  }
};
module.exports={adminMiddleware,authMiddleware}
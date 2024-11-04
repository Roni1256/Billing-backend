import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJwt = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "No token found" });
    }

    const isValid = jwt.verify(token, process.env.JWT_SECRET);

    if (!isValid) {
      return res.status(401).json({ error: "invalid token" });
    }

    const isUser = await User.findById(isValid.userId).select("-password");

    if (!isUser) {
      return res.status(401).json({ error: "No user found" });
    }

    req.user = isUser;
    next();
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

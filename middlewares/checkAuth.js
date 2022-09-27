import jwt from "jsonwebtoken";
import CustomError from "../models/CustomError.js";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || null;

  if (!token) {
    return next(new CustomError("You are not authenticated", 401));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      throw new Error("Invalid token");
    }
    req.userData = decodedToken;
    next();
  } catch (error) {
    return next(new CustomError("Invalid token", 401));
  }
};

export default verifyToken;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = payload => {
  const token = jwt.sign(
    {
      id: payload,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

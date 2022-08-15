import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import CustomError from "../models/CustomError.js";
import User from "../models/User-model.js";

// REGISTER
export const signupController = async (req, res, next) => {
  try {
    // check if user is already registered
    const userExistAlready = await User.findOne({ $or: [{ name: req.body.name }, { email: req.body.email }] });
    if (userExistAlready) {
      return next(new CustomError("User with provided name or email already registered", 401));
    }

    // hash the password
    const hachedPassword = await bcrypt.hash(req.body.password, 10);

    // create user
    const newUser = await User.create({ ...req.body, password: hachedPassword });
    res.json({ message: "User has been created!" });
  } catch (error) {
    return next(new CustomError("Something went wrong while creating a user", 400));
  }
};

// LOGIN
export const loginController = async (req, res, next) => {
  // check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ name: req.body.name });
    if (!existingUser) {
      return next(new CustomError("Invalid credentials. User not found", 401));
    }

    // check if password matches
    const passwordMatches = await bcrypt.compare(req.body.password, existingUser.password);
    if (!passwordMatches) {
      return next(new CustomError("Password does not match", 401));
    }

    // login user with JWT
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const { password, ...otherUserInfo } = existingUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(otherUserInfo);
  } catch (err) {
    return next(new CustomError("User not found", 400));
  }
};

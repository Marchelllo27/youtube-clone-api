import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import CustomError from "../models/CustomError.js";
import User from "../models/User-model.js";
import { generateToken } from "../utils/generateToken.js";

// REGISTER
export const signupController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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
    const userWhitoutPassword = { ...newUser._doc, password: null };

    const token = generateToken(userWhitoutPassword._id);

    return res.status(201).json({
      user: userWhitoutPassword,
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Something went wrong while creating a user", 400));
  }
};

// LOGIN
export const loginController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // check if user exists
  let existingUser;
  try {
    existingUser = await User.findOne({ name: req.body.name });
    if (!existingUser) {
      return next(new CustomError("Invalid credentials. Please try again", 401));
    }

    // check if password matches
    const passwordMatches = await bcrypt.compare(req.body.password, existingUser.password);

    if (!passwordMatches) {
      return next(new CustomError("Invalid credentials. Please try again", 401));
    }

    // login user with JWT
    const token = generateToken(existingUser._id);

    const { password, ...otherUserInfo } = existingUser._doc;

    res.json({
      user: { ...otherUserInfo },
      token,
    });
  } catch (err) {
    return next(new CustomError("Something went wrong while login user. Please try again", 400));
  }
};

// GOOGLE
export const googleSignupController = async (req, res, next) => {
  try {
    // IF USER EXISTS ALREADY
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // login user with JWT
      const token = generateToken(user._id);
      const { password, ...userWithoutPassword } = user;

      return res.json({
        user: { ...userWithoutPassword },
        token,
      });
    }

    // CREATE NEW USER
    const newUser = await User.create({ ...req.body, fromGoogle: true });

    const { password, ...userWithoutPassword } = newUser;

    return res.json({
      user: { ...userWithoutPassword },
      token,
    });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Couldn't create an account, please try again.", 400));
  }
};

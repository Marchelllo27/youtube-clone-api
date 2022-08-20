import bcrypt from "bcryptjs";

import CustomError from "../models/CustomError.js";
import User from "../models/User-model.js";
import { generateToken } from "../utils/generateToken.js";

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
    const userWhitoutPassword = { ...newUser._doc, password: null };

    const token = generateToken(userWhitoutPassword._id);

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userWhitoutPassword);
  } catch (error) {
    console.log(error);
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
    const token = generateToken(existingUser._id);

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

// GOOGLE
export const googleSignupController = async (req, res, next) => {
  try {
    // IF USER EXISTS ALREADY
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // login user with JWT
      const token = generateToken(user._id);

      return res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    }

    // CREATE NEW USER
    const newUser = await User.create({ ...req.body, fromGoogle: true });

    return res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(newUser._doc);
  } catch (error) {
    console.log(error);
    return next(new CustomError("Couldn't create an account, please try again.", 400));
  }
};

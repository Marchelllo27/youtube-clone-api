import { body } from "express-validator";

export const signupInfoValidation = [
  body("name", "Username is required!").trim().notEmpty(),
  body("email", "Please enter a valid email !").isEmail(),
  body("password", "Password is Required!")
    .trim()
    .notEmpty()
    .isStrongPassword({ minLength: 6 })
    .withMessage("At least: 1 uppercase and 1 lowercase letter, 1 number, 1 special character"),
  body("confirmPassword", "Required!").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password doesn't match");
    }
    return true;
  }),
];

export const loginInfoValidation = [
  body("name", "Username is required!").trim().notEmpty(),
  body("password", "Password is Required!").trim().notEmpty(),
];

import { Router } from "express";
import { signupInfoValidation, loginInfoValidation } from "../utils/validation/auth-validation.js";
import { signupController, loginController, googleSignupController } from "../controllers/auth-controller.js";

const router = Router();

// CREATE A USER
router.post("/signup", signupInfoValidation, signupController);

// SIGN IN
router.post("/login", loginInfoValidation, loginController);

// GOOGLE AUTH
router.post("/google", googleSignupController);

export default router;

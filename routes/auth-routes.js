import { Router } from "express";
import { signupController, loginController, googleSignupController } from "../controllers/auth-controller.js";

const router = Router();

// CREATE A USER
router.post("/signup", signupController);

// SIGN IN
router.post("/login", loginController);

// GOOGLE AUTH
router.post("/google", googleSignupController);

export default router;

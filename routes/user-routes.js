import { Router } from "express";
import {
  updateUserController,
  deleteUserController,
  getUserController,
  subscribeUserController,
  unsubscribeUserController,
} from "../controllers/user-controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

// update user
router.put("/:id", checkAuth, updateUserController);

// delete user
router.delete("/:id", checkAuth, deleteUserController);

// get user
router.get("/find/:id", getUserController);

// subscribe user
router.put("/sub/:id", checkAuth, subscribeUserController);

// unsubscribe user
router.put("/unsub/:id", checkAuth, unsubscribeUserController);

export default router;

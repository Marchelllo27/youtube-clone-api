import { Router } from "express";
import {
  updateUserController,
  deleteUserController,
  getUserController,
  subscribeUserController,
  unsubscribeUserController,
  likeVideoController,
  dislikeVideoController,
} from "../controllers/user-controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

// update user
router.put("/:id", checkAuth, updateUserController);

// delete user
router.delete("/:id", checkAuth, deleteUserController);

// get user
router.get("/find/:id", checkAuth, getUserController);

// subscribe user
router.put("/sub/:id", checkAuth, subscribeUserController);

// unsubscribe user
router.put("/unsub/:id", checkAuth, unsubscribeUserController);

// like a video
router.put("/like/:videoId", checkAuth, likeVideoController);

// dislike a video
router.put("/like/:videoId", checkAuth, dislikeVideoController);

export default router;

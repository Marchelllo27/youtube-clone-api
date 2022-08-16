import { Router } from "express";
import {
  createVideoController,
  getVideoController,
  updateVideoController,
  deleteVideoController,
  addViewController,
  trendVideoController,
  randomVideoController,
  subscribedVideosController,
  getByTagController,
  searchController,
  likeVideoController,
  dislikeVideoController,
} from "../controllers/video-controller.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

// Create a video
router.post("/", checkAuth, createVideoController);

// Get a video
router.get("/find/:id", getVideoController);

// Update a video
router.put("/:id", checkAuth, updateVideoController);

// Delete a video
router.delete("/:id", checkAuth, deleteVideoController);

// like a video
router.post("/like/:videoId", checkAuth, likeVideoController);

// dislike a video
router.post("/dislike/:videoId", checkAuth, dislikeVideoController);

// OTHERS
router.put("/view/:id", addViewController);
router.get("/trend", trendVideoController);
router.get("/random", randomVideoController);
router.put("/sub", checkAuth, subscribedVideosController);
router.get("/tags", getByTagController);
router.get("/search", searchController);

export default router;

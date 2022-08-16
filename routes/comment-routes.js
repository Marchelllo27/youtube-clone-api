import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";
import {
  addCommentController,
  deleteCommentController,
  getAllCommentsController,
} from "../controllers/comment-controller.js";

const router = Router();

router.post("/", checkAuth, addCommentController);
router.delete("/:id", checkAuth, deleteCommentController);
router.get("/:videoId", checkAuth, getAllCommentsController);

export default router;

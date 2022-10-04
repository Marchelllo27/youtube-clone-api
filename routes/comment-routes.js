import { Router } from "express";
import checkAuth from "../middlewares/checkAuth.js";
import {
  addCommentController,
  deleteCommentController,
  getAllCommentsController,
} from "../controllers/comment-controller.js";
import { commentValidation } from "../utils/validation/comment-validation.js";

const router = Router();

router.post("/", checkAuth, commentValidation, addCommentController);
router.delete("/:id", checkAuth, deleteCommentController);
router.get("/:videoId", getAllCommentsController);

export default router;

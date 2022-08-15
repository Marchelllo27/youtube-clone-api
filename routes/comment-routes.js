import { Router } from "express";
import { commentController } from "../controllers/comment-controller.js";

const router = Router();

router.get("/", commentController);

export default router;

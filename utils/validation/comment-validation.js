import { body } from "express-validator";

export const commentValidation = [
  body("desc", "Comment body is required!").trim().notEmpty(),
  body("videoId", "VideoId is required").trim().notEmpty(),
];

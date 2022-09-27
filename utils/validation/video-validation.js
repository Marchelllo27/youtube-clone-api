import { body } from "express-validator";

export const videoUploadValidation = [
  body("videoUrl", "Video is required!").trim().notEmpty(),
  body("imgUrl", "Image is required!").trim().notEmpty(),
  body("title", "Title is required!").trim().notEmpty(),
  body("desc", "Description is required!").trim().isLength({ min: 10, max: 80 }).withMessage("Description: Minimum 10, Maximum 80 characters").notEmpty(),
  body("tags", "Tags are required!").trim().notEmpty(),
];

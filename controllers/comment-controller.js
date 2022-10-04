import { validationResult } from "express-validator";
// EXTRA
import Comment from "../models/Comment-model.js";
import Video from "../models/Video-model.js";
import CustomError from "../models/CustomError.js";

// ADD COMMENT
export const addCommentController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newComment = new Comment({
      userId: req.userData.id,
      ...req.body,
    });
    const savedComment = await newComment.save();

    return res.status(201).json(savedComment);
  } catch (error) {
    console.log(error);
    return next(new CustomError("Couldn't add a comment", 400));
  }
};

// GET ALL COMMENTS
export const getAllCommentsController = async (req, res, next) => {
  try {
    const allComments = await Comment.find({ videoId: req.params.videoId });

    return res.json(allComments);
  } catch (error) {
    return next(new CustomError("Couldn't fetch the comments. Sorry :(", 400));
  }
};

// DELETE COMMENT
export const deleteCommentController = async (req, res, next) => {
  try {
    const commentToDelete = await Comment.findById(req.params.id);

    if (!commentToDelete) return next(new CustomError("Couldn't delete a comment with provided id", 400));

    const video = await Video.findById(commentToDelete.videoId);

    if (req.userData.id !== commentToDelete.userId || req.userData.id !== video.userId) {
      return next(new CustomError("Couldn't delete a comment. Not authorized", 403));
    }

    await commentToDelete.remove();

    return res.json({ message: "The Comment has been deleted successfully" });
  } catch (error) {
    return next(new CustomError("Couldn't delete a comment", 400));
  }
};

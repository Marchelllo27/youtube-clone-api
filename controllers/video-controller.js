import { validationResult } from "express-validator";
// EXTRA
import CustomError from "../models/CustomError.js";
import User from "../models/User-model.js";
import Video from "../models/Video-model.js";

// CREATE
export const createVideoController = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const videoExistsAlready = await Video.findOne({ title: req.body.title });

    if (videoExistsAlready) return next(new CustomError("Video with the same title already exists", 400));

    const video = new Video({
      userId: req.userData.id,
      ...req.body,
    });

    const savedVideo = await video.save();
    return res.status(201).json(savedVideo);
  } catch (error) {
    console.log(error);
    return next(new CustomError("Couldn't create a video", 400));
  }
};

// GET
export const getVideoController = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id).populate("userId", "-password");
    if (!video) throw new Error("Error");

    return res.json(video);
  } catch (error) {
    return next(new CustomError("Couldn't find video", 404));
  }
};

// UPDATE
export const updateVideoController = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(new CustomError("Couldn't find video to update", 404));
    if (video.userId !== req.userData.id) return next(new CustomError("Not Authorized, to update this video", 403));
    const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.json(updatedVideo);
  } catch (error) {
    return next(new CustomError("Couldn't update the video"));
  }
};

// DELETE
export const deleteVideoController = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(new CustomError("Couldn't find video", 404));
    if (video.userId !== req.userData.id) return next(new CustomError("Couldn't delete video. Not authorized", 403));

    await video.remove();
    res.json({ message: "The video has been deleted" });
  } catch (error) {
    return next(new CustomError("Couldn't delete video.", 400));
  }
};

// LIKES
export const likeVideoController = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.userData.id;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: userId }, // make sure we add like once
      $pull: { dislikes: userId }, // remove userId from dislikes array
    });

    return res.status(201).json({ message: "The video has been liked" });
  } catch (error) {
    return next(new CustomError("Fail to like a video", 400));
  }
};

// DISLIKES
export const dislikeVideoController = async (req, res, next) => {
  const videoId = req.params.videoId;
  const userId = req.userData.id;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: userId }, // make sure we add like once
      $pull: { likes: userId }, // remove userId from likes array
    });

    return res.status(201).json({ message: "The video has been disliked" });
  } catch (error) {
    return next(new CustomError("Fail to dislike a video", 400));
  }
};

// GET ALL VIDEOS OF A CURRENT USER
export const getAllUsersVideos = async (req, res, next) => {
  const currentUserId = req.userData.id;

  try {
    const videos = await Video.find({ userId: currentUserId }).sort({ createdAt: -1 }).populate("userId", "-password");

    if (!videos || !videos.length) return next(new CustomError("No videos found", 404));

    return res.json(videos);
  } catch (error) {
    return next(new CustomError("Fail to load user's videos!", 400));
  }
};

// GET ALL VIDEOS OF A USER BY HIS ID
export const getAllVideosByUserId = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const videos = await Video.find({ userId: userId }).sort({ createdAt: -1 }).populate("userId", "-password");

    if (!videos || !videos.length) return next(new CustomError("No videos found", 404));

    return res.json(videos);
  } catch (error) {
    return next(new CustomError("Fail to load user's videos!", 400));
  }
};

// VIEWS

export const addViewController = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: {
        views: 1,
      },
    });
    return res.json({ message: "The views has been incresed" });
  } catch (error) {
    return next(new CustomError("Couldn't increase a view", 400));
  }
};

// RANDOM VIDEOS
export const randomVideoController = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);

    await User.populate(videos, { path: "userId", select: { name: 1, img: 1 } });

    if (!videos.length) {
      throw new Error("No Videos found.");
    }

    return res.json(videos);
  } catch (error) {
    console.log(error);
    return next(new CustomError("Couldn't find videos", 400));
  }
};

// TREND
export const trendVideoController = async (req, res, next) => {
  const amount = req.query.quantity;

  try {
    const videos = await Video.find().sort({ views: -1 }).limit(amount).populate("userId", "name img");
    return res.json(videos);
  } catch (error) {
    return next(new CustomError("Couldn't find videos", 400));
  }
};

// SUBSCRIBED VIDEOS
export const subscribedVideosController = async (req, res, next) => {
  const user = await User.findById(req.userData.id);

  const subscribedChannels = user.subscribedUsers;

  const list = await Promise.all(
    subscribedChannels.map(channelId => Video.find({ userId: channelId }).populate("userId", "name img"))
  );

  return res.json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
};

// GET BY TAG

export const getByTagController = async (req, res, next) => {
  const tags = req.query.tags.split(",");

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    return res.json(videos);
  } catch (error) {
    return next(new CustomError("Couldn't find videos by tags", 404));
  }
};

export const searchController = async (req, res, next) => {
  const query = req.query.q;

  try {
    const videos = await Video.find({ title: { $regex: query, $options: "i" } }).limit(40);
    return res.json(videos);
  } catch (error) {
    return next(new CustomError("Couldn't find videos by tags", 404));
  }
};

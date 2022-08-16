import User from "../models/User-model.js";
import CustomError from "../models/CustomError.js";
import Video from "../models/Video-model.js";

// UPDATE USER
export const updateUserController = async (req, res, next) => {
  const userId = req.params.id;

  if (userId !== req.userData.id) {
    return next(new CustomError("You can update only your account"));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    return res.json(updatedUser);
  } catch (error) {
    return next(new CustomError("You can update only your account"));
  }
};

// DELETE USER
export const deleteUserController = async (req, res, next) => {
  const userId = req.params.id;
  if (userId !== req.userData.id) {
    return next(new CustomError("You can delete only your account"));
  }

  try {
    await User.findByIdAndDelete(userId);
    return res.json({ message: "User has been successfully deleted" });
  } catch (error) {
    return next(new CustomError("You can delete only your account"));
  }
};

// GET USER
export const getUserController = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) return next(new CustomError("User with provided id not found"));
    return res.json(user);
  } catch (error) {
    return next(new CustomError("User could not be found"));
  }
};

// SUBSCRIBE USER
export const subscribeUserController = async (req, res, next) => {
  try {
    const userWhichWantSubscribe = await User.findById(req.userData.id);
    if (!userWhichWantSubscribe) return next(new CustomError("Fail to subscribe this user"));

    const isAlreadySubscribedToThisChannel = userWhichWantSubscribe.subscribedUsers.includes(req.params.id);
    if (isAlreadySubscribedToThisChannel) return next(new CustomError("Already subscribed to this channel"));

    userWhichWantSubscribe.subscribedUsers.push(req.params.id);
    userWhichWantSubscribe.save();

    // increase subscribers for channel we subscribe toss
    const userWeSubscribeTo = await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });

    res.json({ message: "Successfully subscribed" });
  } catch (error) {
    return next(new CustomError("Fail to subscribe to the channel"));
  }
};

// UNSUBSCRIBE USER
export const unsubscribeUserController = async (req, res, next) => {
  try {
    const userWhichWantsUnSubscribe = await User.findById(req.userData.id);

    // check if really subscribed to the channel
    const userNotSubscribedToThisChannel = userWhichWantsUnSubscribe.subscribedUsers.findIndex(
      id => id === req.params.id
    );
    if (userNotSubscribedToThisChannel < 0) return next(new CustomError("User not subscribed to this channel", 400));

    userWhichWantsUnSubscribe.subscribedUsers.splice(userNotSubscribedToThisChannel, 1);
    userWhichWantsUnSubscribe.save();

    const userWeSubscribeTo = await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });

    res.json({ message: "Successfully unsubscribed!" });
  } catch (error) {
    console.log(error);
    return next(new CustomError("Fail to unsubscribe to the channel"));
  }
};
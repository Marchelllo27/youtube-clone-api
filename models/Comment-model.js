import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const options = { timestamps: true, versionKey: false };

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    videoId: { type: ObjectId, required: true },
    desc: { type: String, required: true },
  },
  options
);

export default mongoose.model("Comment", CommentSchema);

import mongoose from "mongoose";

const options = { timestamps: true, versionKey: false };

const CommentSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    desc: { type: String, required: true },
  },
  options
);

export default mongoose.model("Comment", CommentSchema);

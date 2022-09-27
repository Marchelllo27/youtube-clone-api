import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const options = { timestamps: true, versionKey: false };

const VideoSchema = new Schema(
  {
    userId: { type: ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
  },
  options
);

export default model("Video", VideoSchema);

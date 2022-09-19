import mongoose from "mongoose";

const ObjectId = mongoose.ObjectId;

const options = { timestamps: true, versionKey: false };

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String },
    subscribers: { type: Number, default: 0 },
    subscribedUsers: { type: [ObjectId], default: [] },
    fromGoogle: { type: Boolean, default: false },
  },
  options
);

export default mongoose.model("User", UserSchema);

import mongoose from "mongoose";
const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const options = { timestamps: true, versionKey: false };

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    img: { type: String },
    subscribers: { type: Number, default: 0 },
    subscribedUsers: { type: [String], default: [] },
    fromGoogle: { type: Boolean, default: false },
  },
  options
);

export default model("User", UserSchema);
